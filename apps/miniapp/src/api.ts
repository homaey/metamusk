import { getInitData } from "./telegram.js";

const BASE = (import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE_URL ?? "http://localhost:8787";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      // Send the Telegram session for verification (empty string in plain browser).
      Authorization: `tma ${getInitData()}`,
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message ?? `Request failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export interface NetworkInfo {
  id: string;
  family: string;
  name: string;
  nativeSymbol: string;
  isTestnet: boolean;
}

export interface BalanceResult {
  networkId: string;
  symbol: string;
  decimals: number;
  raw: string;
  formatted: string;
}

export interface TokenBalance {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  coingeckoId?: string;
  raw: string;
  formatted: string;
}

export interface Utxo { txid: string; vout: number; value: number; }

export interface NftItem {
  id: string;
  name: string;
  imageUrl: string | null;
  collection: string | null;
  tokenAddress?: string;
  tokenId?: string;
}

export interface TxRecord {
  hash: string; from: string; to: string | null;
  value: string; symbol: string; timestamp: string;
  status: "ok" | "error" | "pending"; direction: "in" | "out" | "self"; fee?: string;
}

export interface SwapTx { to: string; data: string; value: string; gasLimit: string; gasPrice: string; chainId: number }
export interface SwapQuote {
  route: string;
  fromToken: { symbol: string; address: string; decimals: number };
  toToken: { symbol: string; address: string; decimals: number };
  toAmountFormatted: string;
  toAmountMinFormatted: string;
  fromAmountUsd: number | null;
  toAmountUsd: number | null;
  priceImpact: number | null;
  gasUsd: number | null;
  tx: SwapTx | null;
}

export const api = {
  health: () => request<{ status: string; time: string }>("/health"),
  networks: () => request<{ networks: NetworkInfo[] }>("/v1/networks"),
  session: () =>
    request<{ user: unknown; featureFlags: Record<string, boolean> }>("/v1/auth/session", {
      method: "POST",
    }),
  prices: (ids: string[]) =>
    request<{ prices: Record<string, number> }>(`/v1/prices?ids=${encodeURIComponent(ids.join(","))}`),
  balance: (network: string, address: string) =>
    request<BalanceResult>(`/v1/balances?network=${encodeURIComponent(network)}&address=${encodeURIComponent(address)}`),
  tokenBalances: (network: string, address: string) =>
    request<{ tokens: TokenBalance[] }>(`/v1/token-balances?network=${encodeURIComponent(network)}&address=${encodeURIComponent(address)}`),
  evmPrepare: (network: string, address: string) =>
    request<{ chainId: number; nonce: number; maxFeePerGas: string; maxPriorityFeePerGas: string; gas: string }>(
      `/v1/evm/prepare?network=${encodeURIComponent(network)}&address=${encodeURIComponent(address)}`,
    ),
  broadcast: (network: string, signed: string) =>
    request<{ hash: string | null }>("/v1/broadcast", {
      method: "POST",
      body: JSON.stringify({ network, signed }),
    }),
  txHistory: (network: string, address: string) =>
    request<{ txs: TxRecord[] }>(`/v1/tx-history?network=${encodeURIComponent(network)}&address=${encodeURIComponent(address)}`),
  tonSeqno: (address: string) =>
    request<{ seqno: number }>(`/v1/ton/seqno?address=${encodeURIComponent(address)}`),
  solanaBlockhash: () =>
    request<{ blockhash: string; lastValidBlockHeight: number }>("/v1/solana/blockhash"),
  bitcoinUtxos: (address: string) =>
    request<{ utxos: Utxo[] }>(`/v1/bitcoin/utxos?address=${encodeURIComponent(address)}`),
  bitcoinFeeRate: () =>
    request<{ fastestFee: number; halfHourFee: number; hourFee: number }>("/v1/bitcoin/fee-rate"),
  nfts: (network: string, address: string) =>
    request<{ nfts: NftItem[] }>(`/v1/nfts?network=${encodeURIComponent(network)}&address=${encodeURIComponent(address)}`),
  swapQuote: (p: { network: string; from: string; to: string; amount: string; address: string }) =>
    request<SwapQuote>(
      `/v1/swap/quote?network=${encodeURIComponent(p.network)}&from=${encodeURIComponent(p.from)}&to=${encodeURIComponent(p.to)}&amount=${encodeURIComponent(p.amount)}&address=${encodeURIComponent(p.address)}`,
    ),
};
