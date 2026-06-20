/**
 * Network registry. TON stays as the Telegram-native priority; alongside it we
 * support the requested set: Ethereum, BNB Smart Chain, Polygon (all EVM),
 * Solana (ed25519), and Bitcoin (secp256k1 / native segwit).
 *
 * rpcUrl is intentionally omitted here — endpoints are injected from env/secrets
 * at provider-construction time, never hardcoded.
 */
import type { NetworkConfig } from "./types.js";

export const NETWORKS: Record<string, NetworkConfig> = {
  "ton:mainnet": {
    id: "ton:mainnet",
    family: "ton",
    name: "TON",
    nativeSymbol: "TON",
    nativeDecimals: 9,
    explorerUrl: "https://tonviewer.com",
    isTestnet: false,
  },
  "ton:testnet": {
    id: "ton:testnet",
    family: "ton",
    name: "TON Testnet",
    nativeSymbol: "TON",
    nativeDecimals: 9,
    explorerUrl: "https://testnet.tonviewer.com",
    isTestnet: true,
  },
  "evm:1": {
    id: "evm:1",
    family: "evm",
    name: "Ethereum",
    nativeSymbol: "ETH",
    nativeDecimals: 18,
    chainId: 1,
    explorerUrl: "https://etherscan.io",
    isTestnet: false,
  },
  "evm:42161": {
    id: "evm:42161",
    family: "evm",
    name: "Arbitrum One",
    nativeSymbol: "ETH",
    nativeDecimals: 18,
    chainId: 42161,
    explorerUrl: "https://arbiscan.io",
    isTestnet: false,
  },
  "evm:10": {
    id: "evm:10",
    family: "evm",
    name: "Optimism",
    nativeSymbol: "ETH",
    nativeDecimals: 18,
    chainId: 10,
    explorerUrl: "https://optimistic.etherscan.io",
    isTestnet: false,
  },
  "evm:8453": {
    id: "evm:8453",
    family: "evm",
    name: "Base",
    nativeSymbol: "ETH",
    nativeDecimals: 18,
    chainId: 8453,
    explorerUrl: "https://basescan.org",
    isTestnet: false,
  },
  "evm:56": {
    id: "evm:56",
    family: "evm",
    name: "BNB Smart Chain",
    nativeSymbol: "BNB",
    nativeDecimals: 18,
    chainId: 56,
    explorerUrl: "https://bscscan.com",
    isTestnet: false,
  },
  "evm:137": {
    id: "evm:137",
    family: "evm",
    name: "Polygon",
    nativeSymbol: "POL",
    nativeDecimals: 18,
    chainId: 137,
    explorerUrl: "https://polygonscan.com",
    isTestnet: false,
  },
  "evm:43114": {
    id: "evm:43114",
    family: "evm",
    name: "Avalanche",
    nativeSymbol: "AVAX",
    nativeDecimals: 18,
    chainId: 43114,
    explorerUrl: "https://snowtrace.io",
    isTestnet: false,
  },
  "solana:mainnet": {
    id: "solana:mainnet",
    family: "solana",
    name: "Solana",
    nativeSymbol: "SOL",
    nativeDecimals: 9,
    explorerUrl: "https://solscan.io",
    isTestnet: false,
  },
  "bitcoin:mainnet": {
    id: "bitcoin:mainnet",
    family: "bitcoin",
    name: "Bitcoin",
    nativeSymbol: "BTC",
    nativeDecimals: 8,
    explorerUrl: "https://mempool.space",
    isTestnet: false,
  },
};

export function getNetwork(id: string): NetworkConfig {
  const n = NETWORKS[id];
  if (!n) throw new Error(`Unknown network: ${id}`);
  return n;
}

/** All networks of a given family (e.g. every EVM chain). */
export function networksByFamily(family: NetworkConfig["family"]): NetworkConfig[] {
  return Object.values(NETWORKS).filter((n) => n.family === family);
}
