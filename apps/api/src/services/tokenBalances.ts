/**
 * Token (non-native) balances for an address on a network. EVM uses Multicall3
 * to batch ERC-20 balanceOf; Solana reads SPL token accounts. Only tokens from
 * the curated registry are returned (so we never surface unknown/spam tokens),
 * and only those with a non-zero balance.
 */
import {
  getNetwork,
  tokensForNetwork,
  formatUnits,
  EvmProvider,
  SolanaProvider,
  type TokenInfo,
} from "@nova/chains";
import { RPC } from "../config.js";

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  coingeckoId?: string;
  raw: string;
  formatted: string;
}

function toResult(tok: TokenInfo, raw: string): TokenBalance {
  return {
    symbol: tok.symbol,
    name: tok.name,
    address: tok.address!,
    decimals: tok.decimals,
    coingeckoId: tok.coingeckoId,
    raw,
    formatted: formatUnits(BigInt(raw), tok.decimals),
  };
}

export async function getTokenBalances(networkId: string, address: string): Promise<TokenBalance[]> {
  const net = getNetwork(networkId);
  const rpcUrl = RPC[networkId];
  if (!rpcUrl) return [];
  const tokens = tokensForNetwork(networkId).filter((t) => !t.native && t.address);

  if (net.family === "evm") {
    const provider = new EvmProvider({ ...net, rpcUrl });
    const raws = await provider.getTokenBalances(
      address as `0x${string}`,
      tokens.map((t) => t.address as `0x${string}`),
    );
    return tokens
      .map((t, i) => toResult(t, raws[i] ?? "0"))
      .filter((t) => BigInt(t.raw) > 0n);
  }

  if (net.family === "solana") {
    const provider = new SolanaProvider({ ...net, rpcUrl });
    const byMint = await provider.getTokenBalances(address);
    return tokens
      .map((t) => toResult(t, byMint[t.address!] ?? "0"))
      .filter((t) => BigInt(t.raw) > 0n);
  }

  // TON jettons / Bitcoin: no token balances yet.
  return [];
}
