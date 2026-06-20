import type { FastifyInstance } from "fastify";
import { NETWORKS } from "@nova/chains";
import { requireTelegramAuth } from "../plugins/telegramAuth.js";
import { getPrices } from "../services/prices.js";
import { getNativeBalance } from "../services/balances.js";
import { prepareEvm, broadcast } from "../services/tx.js";
import { getTokenBalances } from "../services/tokenBalances.js";
import { swapQuote } from "../services/swap.js";
import { getTxHistory } from "../services/txHistory.js";
import { getNfts } from "../services/nfts.js";
import { RPC } from "../config.js";

/**
 * Phase-1 routes. Read-only/metadata only — no endpoint accepts or returns key
 * material. Swap/bridge build (which return UNSIGNED txs) arrive in Phase 2.
 */
export async function registerRoutes(app: FastifyInstance): Promise<void> {
  // Liveness — unauthenticated so health checks / previews work without a session.
  app.get("/health", async () => ({ status: "ok", time: new Date().toISOString() }));

  // Public network registry.
  app.get("/v1/networks", async () => ({
    networks: Object.values(NETWORKS),
  }));

  // Token prices (USD) — comma-separated CoinGecko ids.
  app.get("/v1/prices", async (req, reply) => {
    const ids = String((req.query as { ids?: string }).ids ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 50);
    if (ids.length === 0) {
      return reply.code(400).send({ error: { code: "bad_request", message: "Provide ?ids=", hint: "e.g. ids=bitcoin,ethereum" } });
    }
    return { prices: await getPrices(ids) };
  });

  // Token (non-native) balances for an address on a network.
  app.get("/v1/token-balances", async (req, reply) => {
    const { network, address } = req.query as { network?: string; address?: string };
    if (!network || !NETWORKS[network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown network.", hint: "Use /v1/networks" } });
    }
    if (!address || address.length < 8 || address.length > 120) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Missing or malformed address.", hint: "Pass ?address=" } });
    }
    try {
      return { tokens: await getTokenBalances(network, address) };
    } catch (err) {
      req.log.warn({ network, err: (err as Error).message }, "token balances failed");
      return reply.code(502).send({ error: { code: "tokens_unavailable", message: "Couldn't load token balances.", hint: "Try again." } });
    }
  });

  // Native balance for an address on a network.
  app.get("/v1/balances", async (req, reply) => {
    const { network, address } = req.query as { network?: string; address?: string };
    if (!network || !NETWORKS[network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown or missing network.", hint: "Use an id from /v1/networks" } });
    }
    if (!address || address.length < 8 || address.length > 120) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Missing or malformed address.", hint: "Pass ?address=" } });
    }
    try {
      return await getNativeBalance(network, address);
    } catch (err) {
      req.log.warn({ network, err: (err as Error).message }, "balance lookup failed");
      return reply.code(502).send({ error: { code: "balance_unavailable", message: "Couldn't reach the network right now.", hint: "Try again shortly." } });
    }
  });

  // Prepare an EVM native transfer (nonce + fees). Client builds & signs locally.
  app.get("/v1/evm/prepare", async (req, reply) => {
    const { network, address } = req.query as { network?: string; address?: string };
    if (!network || !NETWORKS[network] || NETWORKS[network]!.family !== "evm") {
      return reply.code(400).send({ error: { code: "bad_network", message: "EVM network required.", hint: "Use an evm:* id" } });
    }
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Valid EVM address required.", hint: "0x…" } });
    }
    try {
      return await prepareEvm(network, address);
    } catch (err) {
      req.log.warn({ network, err: (err as Error).message }, "prepare failed");
      return reply.code(502).send({ error: { code: "prepare_failed", message: "Couldn't reach the network.", hint: "Try again." } });
    }
  });

  // DeFi swap quote (EVM via LI.FI). Returns a normalized quote + UNSIGNED tx.
  app.get("/v1/swap/quote", async (req, reply) => {
    const q = req.query as Record<string, string | undefined>;
    if (!q.network || !NETWORKS[q.network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown network.", hint: "Use /v1/networks" } });
    }
    if (!q.from || !q.to || !q.amount || !q.address) {
      return reply.code(400).send({ error: { code: "bad_request", message: "Missing from/to/amount/address.", hint: "" } });
    }
    if (!/^\d+(\.\d+)?$/.test(q.amount) || Number(q.amount) <= 0) {
      return reply.code(400).send({ error: { code: "bad_amount", message: "Invalid amount.", hint: "" } });
    }
    try {
      return await swapQuote({
        networkId: q.network, from: q.from, to: q.to, amount: q.amount, address: q.address,
        slippage: q.slippage ? Number(q.slippage) : undefined,
      });
    } catch (err) {
      return reply.code(502).send({ error: { code: "quote_failed", message: (err as Error).message.slice(0, 160), hint: "Try a different amount or pair." } });
    }
  });

  // Relay an already-signed transaction. Never signs.
  app.post("/v1/broadcast", async (req, reply) => {
    const { network, signed } = (req.body ?? {}) as { network?: string; signed?: string };
    if (!network || !NETWORKS[network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown network.", hint: "Use /v1/networks" } });
    }
    if (!signed || typeof signed !== "string" || signed.length < 8) {
      return reply.code(400).send({ error: { code: "bad_payload", message: "Missing signed transaction.", hint: "Send { network, signed }" } });
    }
    try {
      return await broadcast(network, signed);
    } catch (err) {
      // Node errors (e.g. insufficient funds) are surfaced verbatim-ish for the user.
      return reply.code(400).send({ error: { code: "broadcast_rejected", message: (err as Error).message.slice(0, 200), hint: "Check balance and inputs." } });
    }
  });

  // Transaction history for an address on any supported network.
  app.get("/v1/tx-history", async (req, reply) => {
    const { network, address } = req.query as { network?: string; address?: string };
    if (!network || !NETWORKS[network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown network.", hint: "Use /v1/networks" } });
    }
    if (!address || address.length < 8 || address.length > 120) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Missing or malformed address." } });
    }
    try {
      return { txs: await getTxHistory(network, address) };
    } catch (err) {
      req.log.warn({ network, err: (err as Error).message }, "tx-history failed");
      return { txs: [] };
    }
  });

  // TON wallet seqno — needed by the client before building a signed transfer.
  app.get("/v1/ton/seqno", async (req, reply) => {
    const { address } = req.query as { address?: string };
    if (!address || address.length < 8) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Missing TON address." } });
    }
    try {
      if (!RPC["ton:mainnet"]) throw new Error("No TON RPC configured");
      // Use direct toncenter REST to get seqno without the public key
      const url = `https://toncenter.com/api/v2/runGetMethod?address=${encodeURIComponent(address)}&method=seqno&stack=[]`;
      const res = await fetch(url);
      if (!res.ok) return reply.code(502).send({ error: { code: "ton_unavailable", message: "TON RPC unavailable." } });
      const data = (await res.json()) as { ok: boolean; result?: { stack?: [[string, string]] } };
      if (!data.ok || !data.result?.stack?.[0]) return { seqno: 0 };
      const hex = data.result.stack[0][1];
      return { seqno: parseInt(hex, 16) || 0 };
    } catch {
      return { seqno: 0 };
    }
  });

  // Solana latest blockhash — lets the client build + sign SOL txs without a client RPC.
  app.get("/v1/solana/blockhash", async (req, reply) => {
    try {
      const rpcUrl = RPC["solana:mainnet"]!;
      const res = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getLatestBlockhash", params: [{ commitment: "confirmed" }] }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Solana RPC ${res.status}`);
      const data = (await res.json()) as { result: { value: { blockhash: string; lastValidBlockHeight: number } } };
      return data.result.value;
    } catch (err) {
      req.log.warn({ err: (err as Error).message }, "solana blockhash failed");
      return reply.code(502).send({ error: { code: "solana_unavailable", message: "Couldn't reach Solana RPC." } });
    }
  });

  // Bitcoin UTXOs for a given address — lets the client build + sign BTC txs without a client API key.
  app.get("/v1/bitcoin/utxos", async (req, reply) => {
    const { address } = req.query as { address?: string };
    if (!address || address.length < 8 || address.length > 100) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Missing or malformed Bitcoin address." } });
    }
    try {
      const res = await fetch(`https://mempool.space/api/address/${encodeURIComponent(address)}/utxo`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`mempool.space ${res.status}`);
      return { utxos: await res.json() };
    } catch (err) {
      req.log.warn({ err: (err as Error).message }, "bitcoin utxos failed");
      return reply.code(502).send({ error: { code: "bitcoin_unavailable", message: "Couldn't reach Bitcoin API." } });
    }
  });

  // Bitcoin recommended fee rates (sat/vbyte).
  app.get("/v1/bitcoin/fee-rate", async (req, reply) => {
    try {
      const res = await fetch("https://mempool.space/api/v1/fees/recommended", {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`mempool.space ${res.status}`);
      return await res.json();
    } catch (err) {
      req.log.warn({ err: (err as Error).message }, "bitcoin fee-rate failed");
      return reply.code(502).send({ error: { code: "bitcoin_unavailable", message: "Couldn't reach Bitcoin fee API." } });
    }
  });

  // NFTs owned by an address (EVM via Blockscout, TON via tonapi.io).
  app.get("/v1/nfts", async (req, reply) => {
    const { network, address } = req.query as { network?: string; address?: string };
    if (!network || !NETWORKS[network]) {
      return reply.code(400).send({ error: { code: "bad_network", message: "Unknown network." } });
    }
    if (!address || address.length < 8 || address.length > 120) {
      return reply.code(400).send({ error: { code: "bad_address", message: "Missing or malformed address." } });
    }
    try {
      return { nfts: await getNfts(network, address) };
    } catch (err) {
      req.log.warn({ network, err: (err as Error).message }, "nft fetch failed");
      return { nfts: [] };
    }
  });

  // Verify the Telegram session and return a minimal profile.
  app.post("/v1/auth/session", { preHandler: requireTelegramAuth }, async (req) => ({
    user: req.telegramUser ?? null,
    featureFlags: { swaps: false, bridge: false, regulatedModules: false },
  }));

  // Example authenticated metadata route (wallet list would read from DB in full impl).
  app.get("/v1/me", { preHandler: requireTelegramAuth }, async (req) => ({
    user: req.telegramUser ?? null,
    prefs: { language: req.telegramUser?.language_code ?? "en", theme: "system" },
  }));
}
