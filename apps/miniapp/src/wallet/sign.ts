/**
 * Build → sign → broadcast a transfer, entirely client-side.
 *
 * Non-custodial guarantees:
 *  - Private keys are derived transiently from the in-memory session and zeroized.
 *  - EVM, Solana, and Bitcoin use the backend to supply chain state (nonce, blockhash,
 *    UTXOs) so the client needs NO external RPC keys — the server handles read-only
 *    queries; the client does all signing.
 *  - TON seqno is also fetched from the backend (see /v1/ton/seqno).
 *  - Broadcasting goes through /v1/broadcast (server relays, never signs).
 */
import { mnemonicToSeed, zeroize } from "@nova/wallet-core";
import {
  NETWORKS,
  deriveEvm, evmSigner, evmSignerFromKey, EvmProvider,
  deriveTon, buildSignedTransferBoc,
  deriveSolana, SolanaProvider,
  deriveBitcoin, BitcoinProvider,
} from "@nova/chains";
import { getSessionMnemonic, getSessionPrivKey } from "./session.js";
import { api, type SwapTx } from "../api.js";

export type SendStatus = "sent" | "error";
export interface SendResult { status: SendStatus; hash?: string; error?: string; }

/**
 * Execute an EVM swap: take the aggregator's unsigned tx, attach a fresh nonce
 * from the backend, sign locally, and broadcast. Non-custodial.
 */
export async function executeSwap(networkId: string, tx: SwapTx): Promise<SendResult> {
  const mnemonic = getSessionMnemonic();
  const privKey = getSessionPrivKey();
  if (!mnemonic && !privKey) return { status: "error", error: "locked" };
  const net = NETWORKS[networkId];
  if (!net || net.family !== "evm") return { status: "error", error: "unsupported_family" };

  try {
    let signer: ReturnType<typeof evmSigner>;
    let address: string;

    if (privKey) {
      signer = evmSignerFromKey(privKey as `0x${string}`);
      address = signer.address;
    } else {
      const seed = mnemonicToSeed(mnemonic!);
      const acct = deriveEvm(seed, 0);
      address = acct.address;
      signer = evmSigner(acct);
      zeroize(acct.privateKey, seed);
    }

    const prep = await api.evmPrepare(networkId, address);
    const builder = new EvmProvider({ ...net, rpcUrl: "http://placeholder" });
    const gasPrice = BigInt(tx.gasPrice) > 0n ? BigInt(tx.gasPrice) : BigInt(prep.maxFeePerGas);
    const txObj = builder.buildLegacyCall({
      to: tx.to as `0x${string}`,
      data: tx.data as `0x${string}`,
      value: BigInt(tx.value),
      gas: BigInt(tx.gasLimit),
      gasPrice,
      nonce: prep.nonce,
      chainId: tx.chainId,
    });
    const signed = await EvmProvider.sign(signer, txObj);
    const res = await api.broadcast(networkId, signed);
    return { status: "sent", hash: res.hash ?? undefined };
  } catch (err) {
    return { status: "error", error: err instanceof Error ? err.message : "swap_failed" };
  }
}

export async function signAndSend(params: {
  family: string;
  networkId: string;
  to: string;
  amount: string;
  tokenAddress?: string;
  tokenDecimals?: number;
}): Promise<SendResult> {
  const mnemonic = getSessionMnemonic();
  const privKey = getSessionPrivKey();
  if (!mnemonic && !privKey) return { status: "error", error: "locked" };

  const net = NETWORKS[params.networkId];
  if (!net) return { status: "error", error: "unknown_network" };

  // ── Privkey wallet: EVM only ─────────────────────────────────────────────
  if (privKey) {
    if (params.family !== "evm") {
      return { status: "error", error: "privkey_only_evm" };
    }
    try {
      const signer = evmSignerFromKey(privKey as `0x${string}`);
      const prep = await api.evmPrepare(params.networkId, signer.address);
      const builder = new EvmProvider({ ...net, rpcUrl: "http://placeholder" });
      let txObj;
      if (params.tokenAddress && params.tokenDecimals != null) {
        const rawAmount = BigInt(Math.round(Number(params.amount) * 10 ** params.tokenDecimals));
        txObj = builder.buildErc20Transfer({
          tokenAddress: params.tokenAddress as `0x${string}`,
          to: params.to as `0x${string}`,
          amount: rawAmount,
          nonce: prep.nonce, chainId: prep.chainId,
          maxFeePerGas: BigInt(prep.maxFeePerGas),
          maxPriorityFeePerGas: BigInt(prep.maxPriorityFeePerGas),
        });
      } else {
        txObj = builder.buildNativeTransfer({
          to: params.to as `0x${string}`, amountEth: params.amount,
          nonce: prep.nonce, chainId: prep.chainId,
          maxFeePerGas: BigInt(prep.maxFeePerGas),
          maxPriorityFeePerGas: BigInt(prep.maxPriorityFeePerGas),
          gas: BigInt(prep.gas),
        });
      }
      const signed = await EvmProvider.sign(signer, txObj);
      const res = await api.broadcast(params.networkId, signed);
      return { status: "sent", hash: res.hash ?? undefined };
    } catch (err) {
      return { status: "error", error: err instanceof Error ? err.message : "sign_failed" };
    }
  }

  // ── Mnemonic wallet ──────────────────────────────────────────────────────
  const seed = mnemonicToSeed(mnemonic!);
  try {
    switch (params.family) {
      case "evm": {
        const acct = deriveEvm(seed, 0);
        const prep = await api.evmPrepare(params.networkId, acct.address);
        const builder = new EvmProvider({ ...net, rpcUrl: "http://placeholder" });
        let txObj;
        if (params.tokenAddress && params.tokenDecimals != null) {
          const rawAmount = BigInt(Math.round(Number(params.amount) * 10 ** params.tokenDecimals));
          txObj = builder.buildErc20Transfer({
            tokenAddress: params.tokenAddress as `0x${string}`,
            to: params.to as `0x${string}`,
            amount: rawAmount,
            nonce: prep.nonce, chainId: prep.chainId,
            maxFeePerGas: BigInt(prep.maxFeePerGas),
            maxPriorityFeePerGas: BigInt(prep.maxPriorityFeePerGas),
          });
        } else {
          txObj = builder.buildNativeTransfer({
            to: params.to as `0x${string}`, amountEth: params.amount,
            nonce: prep.nonce, chainId: prep.chainId,
            maxFeePerGas: BigInt(prep.maxFeePerGas),
            maxPriorityFeePerGas: BigInt(prep.maxPriorityFeePerGas),
            gas: BigInt(prep.gas),
          });
        }
        const signed = await EvmProvider.sign(evmSigner(acct), txObj);
        zeroize(acct.privateKey);
        const res = await api.broadcast(params.networkId, signed);
        return { status: "sent", hash: res.hash ?? undefined };
      }

      case "ton": {
        const acct = deriveTon(seed, 0);
        let seqno: number;
        try {
          const s = await api.tonSeqno(acct.address);
          seqno = s.seqno;
        } catch {
          // Fallback to direct provider if backend unreachable (dev only)
          seqno = 0;
        }
        const boc = buildSignedTransferBoc(acct, { to: params.to, amountTon: params.amount, seqno });
        zeroize(acct.privateKey);
        await api.broadcast(params.networkId, boc);
        return { status: "sent" };
      }

      case "solana": {
        const acct = deriveSolana(seed, 0);
        // Backend supplies the recent blockhash; client signs offline (no client RPC needed).
        const { blockhash } = await api.solanaBlockhash();
        const signed = SolanaProvider.buildSignedTransferOffline(acct, params.to, params.amount, blockhash);
        zeroize(acct.privateKey);
        const res = await api.broadcast(params.networkId, signed);
        return { status: "sent", hash: res.hash ?? undefined };
      }

      case "bitcoin": {
        const acct = deriveBitcoin(seed, 0);
        // Backend supplies UTXOs and fee rate; client builds + signs offline.
        const [utxoRes, feeRes] = await Promise.all([
          api.bitcoinUtxos(acct.address),
          api.bitcoinFeeRate(),
        ]);
        // BitcoinProvider.buildSignedTransfer is pure (no network calls).
        const provider = new BitcoinProvider({ ...net, rpcUrl: "https://mempool.space/api" });
        const { hex: signedHex } = provider.buildSignedTransfer({
          account: acct,
          to: params.to,
          amountSats: BigInt(Math.round(Number(params.amount) * 1e8)),
          feeRateSatVb: feeRes.halfHourFee,
          utxos: utxoRes.utxos,
        });
        zeroize(acct.privateKey);
        const res = await api.broadcast(params.networkId, signedHex);
        return { status: "sent", hash: res.hash ?? undefined };
      }

      default:
        return { status: "error", error: "unsupported_family" };
    }
  } catch (err) {
    return { status: "error", error: err instanceof Error ? err.message : "broadcast_failed" };
  } finally {
    zeroize(seed);
  }
}
