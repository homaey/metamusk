import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "node:url";

// Load .env from the repo root if present (dev convenience). Never commit secrets.
loadEnv({ path: fileURLToPath(new URL("../../../.env", import.meta.url)) });

export const config = {
  port: Number(process.env.PORT ?? process.env.API_PORT ?? 8787),
  nodeEnv: process.env.NODE_ENV ?? "development",
  botToken: process.env.TELEGRAM_BOT_TOKEN ?? "",
  initDataMaxAge: Number(process.env.INITDATA_MAX_AGE_SECONDS ?? 86400),
  /**
   * Dev-only escape hatch: when set AND not in production, skip initData
   * verification so the Mini App can be developed in a plain browser without a
   * bot token. NEVER enable in production.
   */
  devSkipInitData:
    process.env.DEV_SKIP_INITDATA === "1" && process.env.NODE_ENV !== "production",
  corsOrigins: (process.env.CORS_ORIGINS ?? "http://localhost:5173").split(","),
};

/**
 * Server-side RPC endpoints, one per network. Public defaults keep the wallet
 * functional out-of-the-box; override per chain via env for production rate limits.
 */
export const RPC: Record<string, string> = {
  "evm:1": process.env.EVM_RPC_URL ?? "https://ethereum-rpc.publicnode.com",
  "evm:42161": process.env.ARBITRUM_RPC_URL ?? "https://arbitrum-one-rpc.publicnode.com",
  "evm:10": process.env.OPTIMISM_RPC_URL ?? "https://optimism-rpc.publicnode.com",
  "evm:8453": process.env.BASE_RPC_URL ?? "https://base-rpc.publicnode.com",
  "evm:56": process.env.BSC_RPC_URL ?? "https://bsc-rpc.publicnode.com",
  "evm:137": process.env.POLYGON_RPC_URL ?? "https://polygon-bor-rpc.publicnode.com",
  "evm:43114": process.env.AVALANCHE_RPC_URL ?? "https://avalanche-c-chain-rpc.publicnode.com",
  "ton:mainnet": process.env.TON_RPC_URL ?? "https://toncenter.com/api/v2/jsonRPC",
  "solana:mainnet": process.env.SOLANA_RPC_URL ?? "https://api.mainnet-beta.solana.com",
  "bitcoin:mainnet": process.env.BITCOIN_API_URL ?? "https://mempool.space/api",
};

export const PRICE_API = process.env.PRICE_API_URL ?? "https://api.coingecko.com/api/v3";

export function assertProdConfig(): void {
  if (config.nodeEnv === "production") {
    if (!config.botToken) throw new Error("TELEGRAM_BOT_TOKEN is required in production.");
    if (config.devSkipInitData) throw new Error("DEV_SKIP_INITDATA must be off in production.");
  }
}
