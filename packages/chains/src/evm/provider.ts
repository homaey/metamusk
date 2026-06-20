/**
 * EVM provider: read-only chain access + unsigned transaction building + local
 * signing + broadcast. The build/sign/broadcast split mirrors the wallet's
 * golden rule — the server may build & broadcast, but only the client signs.
 */
import {
  createPublicClient,
  http,
  parseEther,
  formatEther,
  encodeFunctionData,
  recoverTransactionAddress,
  erc20Abi,
  type Hex,
  type PublicClient,
  type TransactionSerializable,
  type TransactionSerialized,
} from "viem";

/** Multicall3 — deployed at this same address on every major EVM chain. */
const MULTICALL3 = "0xcA11bde05977b3631167028862bE2a173976CA11" as const;
import type { PrivateKeyAccount } from "viem/accounts";
import type { NativeBalance, NetworkConfig } from "../types.js";

export interface EvmNativeTransferParams {
  to: `0x${string}`;
  /** Amount in ETH (decimal string), e.g. "0.01". */
  amountEth: string;
  nonce: number;
  chainId: number;
  /** EIP-1559 fees in wei. */
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
  gas?: bigint;
}

export class EvmProvider {
  private readonly client: PublicClient;

  constructor(private readonly network: NetworkConfig) {
    if (network.family !== "evm" || !network.rpcUrl) {
      throw new Error("EvmProvider requires an EVM network with an rpcUrl.");
    }
    this.client = createPublicClient({ transport: http(network.rpcUrl) });
  }

  async getNativeBalance(address: `0x${string}`): Promise<NativeBalance> {
    const raw = await this.client.getBalance({ address });
    return {
      raw: raw.toString(),
      decimals: this.network.nativeDecimals,
      symbol: this.network.nativeSymbol,
    };
  }

  formatNative(raw: string): string {
    return formatEther(BigInt(raw));
  }

  async getNonce(address: `0x${string}`): Promise<number> {
    return this.client.getTransactionCount({ address });
  }

  /** Suggest EIP-1559 fees from the node. */
  async suggestFees(): Promise<{ maxFeePerGas: bigint; maxPriorityFeePerGas: bigint }> {
    const fees = await this.client.estimateFeesPerGas();
    return {
      maxFeePerGas: fees.maxFeePerGas ?? 2_000_000_000n,
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas ?? 1_000_000_000n,
    };
  }

  /** Whether `address` is a smart contract (has code) — used for risk checks. */
  async isContract(address: `0x${string}`): Promise<boolean> {
    const code = await this.client.getCode({ address });
    return Boolean(code && code !== "0x");
  }

  /**
   * Batch ERC-20 balanceOf for `owner` via Multicall3 (same address on every
   * major EVM chain). Returns raw balances aligned with the input token order.
   */
  async getTokenBalances(
    owner: `0x${string}`,
    tokenAddresses: `0x${string}`[],
  ): Promise<string[]> {
    if (tokenAddresses.length === 0) return [];
    const results = await this.client.multicall({
      multicallAddress: MULTICALL3,
      allowFailure: true,
      contracts: tokenAddresses.map((address) => ({
        address,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [owner] as const,
      })),
    });
    return results.map((r) => (r.status === "success" ? (r.result as bigint).toString() : "0"));
  }

  /** Build an UNSIGNED EIP-1559 native transfer. No keys involved. */
  buildNativeTransfer(p: EvmNativeTransferParams): TransactionSerializable {
    return {
      type: "eip1559",
      to: p.to,
      value: parseEther(p.amountEth),
      chainId: p.chainId,
      nonce: p.nonce,
      gas: p.gas ?? 21000n,
      maxFeePerGas: p.maxFeePerGas,
      maxPriorityFeePerGas: p.maxPriorityFeePerGas,
    };
  }

  /**
   * Build an unsigned EIP-1559 ERC-20 transfer (`token.transfer(to, amount)`).
   * `amount` is in raw token units (already multiplied by 10^decimals).
   */
  buildErc20Transfer(p: {
    tokenAddress: `0x${string}`;
    to: `0x${string}`;
    amount: bigint;
    nonce: number;
    chainId: number;
    maxFeePerGas: bigint;
    maxPriorityFeePerGas: bigint;
    gas?: bigint;
  }): TransactionSerializable {
    const data = encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [p.to, p.amount] });
    return {
      type: "eip1559",
      to: p.tokenAddress,
      value: 0n,
      data,
      chainId: p.chainId,
      nonce: p.nonce,
      gas: p.gas ?? 65000n,
      maxFeePerGas: p.maxFeePerGas,
      maxPriorityFeePerGas: p.maxPriorityFeePerGas,
    };
  }

  /**
   * Build an arbitrary contract-call tx (legacy type) — used for aggregator swaps
   * where the tx carries `data`. Pure (no network); fields come from the quote +
   * a fetched nonce.
   */
  buildLegacyCall(p: {
    to: `0x${string}`;
    data: `0x${string}`;
    value: bigint;
    gas: bigint;
    gasPrice: bigint;
    nonce: number;
    chainId: number;
  }): TransactionSerializable {
    return {
      type: "legacy",
      to: p.to,
      data: p.data,
      value: p.value,
      gas: p.gas,
      gasPrice: p.gasPrice,
      nonce: p.nonce,
      chainId: p.chainId,
    };
  }

  /** Sign an unsigned tx locally with the account's key. Returns raw signed hex. */
  static async sign(
    signer: PrivateKeyAccount,
    tx: TransactionSerializable,
  ): Promise<Hex> {
    return signer.signTransaction(tx);
  }

  /** Recover the sender of a signed raw tx (used by tests + risk display). */
  static async senderOf(serialized: Hex): Promise<`0x${string}`> {
    // viem's recover expects the narrowed serialized-tx union; a signed hex is
    // exactly that at runtime, so the cast is sound.
    return recoverTransactionAddress({
      serializedTransaction: serialized as TransactionSerialized,
    });
  }

  /** Broadcast an already-signed raw transaction. Never signs. */
  async broadcast(serialized: Hex): Promise<`0x${string}`> {
    return this.client.sendRawTransaction({ serializedTransaction: serialized });
  }
}
