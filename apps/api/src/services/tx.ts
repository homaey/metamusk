/**
 * Transaction prep + broadcast proxy. Keeps the wallet non-custodial: the server
 * supplies the data needed to build a tx (nonce/fees) and relays the already-
 * SIGNED payload, but never holds keys and never signs.
 */
import {
  getNetwork,
  EvmProvider,
  TonProvider,
  SolanaProvider,
  BitcoinProvider,
} from "@nova/chains";
import { RPC } from "../config.js";

function rpc(networkId: string): string {
  const url = RPC[networkId];
  if (!url) throw new Error(`No RPC for ${networkId}`);
  return url;
}

export interface EvmPrepared {
  chainId: number;
  nonce: number;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  gas: string;
}

/** Fetch nonce + suggested EIP-1559 fees for a native EVM transfer. */
export async function prepareEvm(networkId: string, address: string): Promise<EvmPrepared> {
  const net = getNetwork(networkId);
  if (net.family !== "evm") throw new Error("prepareEvm: not an EVM network");
  const provider = new EvmProvider({ ...net, rpcUrl: rpc(networkId) });
  const [nonce, fees] = await Promise.all([
    provider.getNonce(address as `0x${string}`),
    provider.suggestFees(),
  ]);
  return {
    chainId: net.chainId!,
    nonce,
    maxFeePerGas: fees.maxFeePerGas.toString(),
    maxPriorityFeePerGas: fees.maxPriorityFeePerGas.toString(),
    gas: "21000",
  };
}

/** Relay a signed transaction for any family. Returns the tx hash where available. */
export async function broadcast(networkId: string, signed: string): Promise<{ hash: string | null }> {
  const net = getNetwork(networkId);
  const cfg = { ...net, rpcUrl: rpc(networkId) };
  switch (net.family) {
    case "evm":
      return { hash: await new EvmProvider(cfg).broadcast(signed as `0x${string}`) };
    case "ton":
      await new TonProvider(cfg).broadcastBoc(signed);
      return { hash: null };
    case "solana":
      return { hash: await new SolanaProvider(cfg).broadcast(signed) };
    case "bitcoin":
      return { hash: await new BitcoinProvider(cfg).broadcast(signed) };
    default:
      throw new Error(`Unsupported family for ${networkId}`);
  }
}
