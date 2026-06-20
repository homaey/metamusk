/** Brand colors per network (for badges/UI). Verified against each project's identity. */
export const NETWORK_COLORS: Record<string, string> = {
  "evm:1": "#627EEA", // Ethereum
  "evm:42161": "#28A0F0", // Arbitrum
  "evm:10": "#FF0420", // Optimism
  "evm:8453": "#0052FF", // Base
  "evm:56": "#F3BA2F", // BNB
  "evm:137": "#8247E5", // Polygon
  "evm:43114": "#E84142", // Avalanche
  "solana:mainnet": "#14F195", // Solana
  "bitcoin:mainnet": "#F7931A", // Bitcoin
  "ton:mainnet": "#0098EA", // TON
  "ton:testnet": "#7AA7C7",
};

export const networkColor = (id: string): string => NETWORK_COLORS[id] ?? "#4f7cff";

/** Network id → Trust Wallet blockchain folder (for logo asset URLs). */
const TW_CHAIN: Record<string, string> = {
  "evm:1": "ethereum",
  "evm:42161": "arbitrum",
  "evm:10": "optimism",
  "evm:8453": "base",
  "evm:56": "smartchain",
  "evm:137": "polygon",
  "evm:43114": "avalanchec",
  "solana:mainnet": "solana",
  "bitcoin:mainnet": "bitcoin",
  "ton:mainnet": "ton",
};

const TW_BASE = "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains";

/** Logo URL for a network's native coin (undefined → caller shows a fallback badge). */
export function nativeLogo(networkId: string): string | undefined {
  const c = TW_CHAIN[networkId];
  return c ? `${TW_BASE}/${c}/info/logo.png` : undefined;
}

/** Logo URL for a token by its contract/mint address on a network. */
export function tokenLogo(networkId: string, address: string | null): string | undefined {
  const c = TW_CHAIN[networkId];
  if (!c || !address) return nativeLogo(networkId);
  return `${TW_BASE}/${c}/assets/${address}/logo.png`;
}

/** Family → CoinGecko id for native-asset pricing (mirrors the token registry). */
export const NATIVE_CG: Record<string, string> = {
  "evm:1": "ethereum",
  "evm:42161": "ethereum",
  "evm:10": "ethereum",
  "evm:8453": "ethereum",
  "evm:56": "binancecoin",
  "evm:137": "matic-network",
  "evm:43114": "avalanche-2",
  "solana:mainnet": "solana",
  "bitcoin:mainnet": "bitcoin",
  "ton:mainnet": "the-open-network",
};
