/**
 * TON Connect v2 — wallet-side bridge implementation.
 *
 * Non-custodial: the TON signing key is derived transiently in sign.ts.
 * The bridge key (X25519) is ephemeral per-session and lives only in RAM.
 *
 * Bridge: https://bridge.tonapi.io/bridge (SSE + POST)
 * Protocol: TON Connect 2.0 (https://github.com/ton-connect/sdk/tree/main/packages/protocol)
 *
 * Encryption: NaCl box (X25519 ECDH + XSalsa20-Poly1305) via tweetnacl.
 */
import nacl from "tweetnacl";
import { buildSignedTransferBoc, deriveTon } from "@nova/chains";
import { mnemonicToSeed, zeroize } from "@nova/wallet-core";
import { getSessionMnemonic } from "./session.js";
import { api } from "../api.js";

const BRIDGE = "https://bridge.tonapi.io/bridge";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TcDappInfo {
  url: string;
  name: string;
  iconUrl: string;
}

export interface TcConnectRequest {
  id: number;
  dappInfo: TcDappInfo;
  items: Array<{ name: string; payload?: string }>;
}

export interface TcTxRequest {
  id: number;
  messages: Array<{ address: string; amount: string; stateInit?: string; payload?: string }>;
  validUntil: number;
}

type ConnectCb = (req: TcConnectRequest) => void;
type TxCb = (req: TcTxRequest) => void;
type StatusCb = () => void;

// ── State ─────────────────────────────────────────────────────────────────────

interface TcSession {
  keypair: nacl.BoxKeyPair;
  clientId: string;
  dappId: string | null;
  dappInfo: TcDappInfo | null;
  connected: boolean;
  pendingConnectId: number | null;
}

let session: TcSession | null = null;
let sse: EventSource | null = null;

const connectCbs: ConnectCb[] = [];
const txCbs: TxCb[] = [];
const statusCbs: StatusCb[] = [];

// ── Helpers ───────────────────────────────────────────────────────────────────

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) out[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  return out;
}

function decryptMsg(msg: string, dappPub: Uint8Array): unknown {
  const bytes = Uint8Array.from(atob(msg), (c) => c.charCodeAt(0));
  const nonce = bytes.slice(0, 24);
  const cipher = bytes.slice(24);
  const plain = nacl.box.open(cipher, nonce, dappPub, session!.keypair.secretKey);
  if (!plain) throw new Error("TC: decryption failed");
  return JSON.parse(new TextDecoder().decode(plain));
}

function encryptMsg(payload: unknown, dappPub: Uint8Array): string {
  const nonce = nacl.randomBytes(24);
  const plain = new TextEncoder().encode(JSON.stringify(payload));
  const cipher = nacl.box(plain, nonce, dappPub, session!.keypair.secretKey);
  const combined = new Uint8Array(nonce.length + cipher.length);
  combined.set(nonce);
  combined.set(cipher, nonce.length);
  return btoa(String.fromCharCode(...combined));
}

async function send(payload: unknown): Promise<void> {
  if (!session?.dappId) throw new Error("TC: no dapp connected");
  const dappPub = fromHex(session.dappId);
  const body = encryptMsg(payload, dappPub);
  const url = `${BRIDGE}/message?client_id=${session.clientId}&to=${session.dappId}&ttl=300`;
  const res = await fetch(url, { method: "POST", body, headers: { "Content-Type": "text/plain" } });
  if (!res.ok) throw new Error(`TC bridge error: ${res.status}`);
}

// ── Bridge SSE ────────────────────────────────────────────────────────────────

function startSSE(): void {
  sse?.close();
  if (!session) return;
  sse = new EventSource(`${BRIDGE}/events?client_id=${session.clientId}`);
  sse.onmessage = async (e) => {
    try {
      const envelope = JSON.parse(e.data) as { from: string; message: string };
      if (!envelope.from || !envelope.message) return;

      if (!session!.dappId) session!.dappId = envelope.from;
      const dappPub = fromHex(envelope.from);
      const msg = decryptMsg(envelope.message, dappPub) as {
        event?: string;
        method?: string;
        id?: number;
        payload?: unknown;
        params?: unknown[];
      };

      if (msg.event === "connect" || msg.method === "ton_connect") {
        await handleConnectRequest(msg);
      } else if (msg.method === "sendTransaction") {
        await handleTxRequest(msg);
      }
    } catch (err) {
      console.error("[TC] bridge error", err);
    }
  };
  sse.onerror = () => {
    // Auto-reconnect after 3s
    setTimeout(startSSE, 3000);
  };
}

async function handleConnectRequest(msg: { id?: number; payload?: unknown; params?: unknown[] }): Promise<void> {
  if (!session) return;
  const payload = (msg.payload ?? (Array.isArray(msg.params) ? msg.params[0] : {})) as {
    manifestUrl?: string;
    items?: Array<{ name: string; payload?: string }>;
  };

  const manifestUrl = payload.manifestUrl ?? "";
  let dappInfo: TcDappInfo = { url: manifestUrl, name: "Unknown DApp", iconUrl: "" };

  if (manifestUrl) {
    try {
      const manifest = await fetch(manifestUrl).then((r) => r.json()) as TcDappInfo & { url: string; name: string; iconUrl: string };
      dappInfo = { url: manifest.url ?? manifestUrl, name: manifest.name ?? "Unknown", iconUrl: manifest.iconUrl ?? "" };
    } catch { /* use default */ }
  }

  session.dappInfo = dappInfo;
  session.pendingConnectId = msg.id ?? 0;
  connectCbs.forEach((cb) => cb({ id: msg.id ?? 0, dappInfo, items: payload.items ?? [{ name: "ton_addr" }] }));
}

async function handleTxRequest(msg: { id?: number; params?: unknown[] }): Promise<void> {
  const paramsStr = (msg.params?.[0] as string) ?? "{}";
  const params = JSON.parse(paramsStr) as {
    messages: Array<{ address: string; amount: string; stateInit?: string; payload?: string }>;
    valid_until?: number;
  };
  txCbs.forEach((cb) => cb({
    id: msg.id ?? 0,
    messages: params.messages ?? [],
    validUntil: params.valid_until ?? 0,
  }));
}

// ── Public API ────────────────────────────────────────────────────────────────

/** Initialize session keypair and start listening on the bridge. */
export function tcInit(): void {
  if (session) return;
  const keypair = nacl.box.keyPair();
  session = {
    keypair,
    clientId: toHex(keypair.publicKey),
    dappId: null,
    dappInfo: null,
    connected: false,
    pendingConnectId: null,
  };
  startSSE();
}

/** Reset session (generates a new keypair). */
export function tcReset(): void {
  sse?.close();
  sse = null;
  session = null;
  tcInit();
  statusCbs.forEach((cb) => cb());
}

export function tcGetClientId(): string {
  if (!session) tcInit();
  return session!.clientId;
}

/** Universal link QR payload — DApp scans this to connect. */
export function tcGetConnectLink(origin: string): string {
  if (!session) tcInit();
  const r = JSON.stringify({
    manifestUrl: `${origin}/tonconnect-manifest.json`,
    items: [{ name: "ton_addr" }],
  });
  return `tc://v1/?universalLink=${encodeURIComponent(origin)}&id=${session!.clientId}&r=${encodeURIComponent(r)}`;
}

export function tcIsConnected(): boolean {
  return session?.connected ?? false;
}

export function tcGetDappInfo(): TcDappInfo | null {
  return session?.dappInfo ?? null;
}

/** Approve the pending connect request — sends wallet TON address to DApp. */
export async function tcApproveConnect(tonAddress: string, tonPublicKeyHex: string): Promise<void> {
  if (!session?.pendingConnectId && session?.pendingConnectId !== 0) throw new Error("No pending TC connect");
  await send({
    event: "connect",
    id: session.pendingConnectId,
    payload: {
      items: [{
        name: "ton_addr",
        address: tonAddress,
        network: "-239",
        publicKey: tonPublicKeyHex,
        walletStateInit: "",
      }],
      device: {
        platform: "browser",
        appName: "MetaMusk",
        appVersion: "1.0",
        maxProtocolVersion: 2,
        features: [{ name: "SendTransaction", maxMessages: 4 }],
      },
    },
  });
  session.connected = true;
  session.pendingConnectId = null;
  statusCbs.forEach((cb) => cb());
}

/** Reject pending connect request. */
export async function tcRejectConnect(): Promise<void> {
  if (!session) return;
  await send({ event: "connect_error", id: session.pendingConnectId ?? 0, payload: { code: 300, message: "User declined" } });
  session.pendingConnectId = null;
}

/** Sign and send a TON transaction, respond to DApp with the boc hash. */
export async function tcApproveTx(reqId: number, messages: TcTxRequest["messages"]): Promise<void> {
  const mnemonic = getSessionMnemonic();
  if (!mnemonic) throw new Error("Wallet locked");

  const seed = mnemonicToSeed(mnemonic);
  try {
    const acct = deriveTon(seed, 0);
    let seqno = 0;
    try { const s = await api.tonSeqno(acct.address); seqno = s.seqno; } catch { /* fallback 0 */ }

    // Sign the first message (multi-message support is a future enhancement)
    const msg = messages[0];
    if (!msg) throw new Error("No messages in TC tx request");
    const amountTon = (Number(msg.amount) / 1e9).toString();
    const boc = buildSignedTransferBoc(acct, { to: msg.address, amountTon, seqno });
    zeroize(acct.privateKey);

    const res = await api.broadcast("ton:mainnet", boc);
    await send({ event: "send_transaction_response", id: reqId, payload: res.hash ?? boc });
  } finally {
    zeroize(seed);
  }
}

/** Reject a TON transaction request. */
export async function tcRejectTx(reqId: number): Promise<void> {
  await send({ event: "send_transaction_error", id: reqId, payload: { code: 300, message: "User declined" } });
}

/** Disconnect from current DApp. */
export async function tcDisconnect(): Promise<void> {
  if (!session?.dappId) return;
  try { await send({ event: "disconnect", payload: {} }); } catch { /* ignore */ }
  session = { ...session, dappId: null, dappInfo: null, connected: false, pendingConnectId: null };
  statusCbs.forEach((cb) => cb());
}

// ── Event subscriptions ───────────────────────────────────────────────────────

export function onTcConnect(cb: ConnectCb): () => void {
  connectCbs.push(cb);
  return () => { const i = connectCbs.indexOf(cb); if (i >= 0) connectCbs.splice(i, 1); };
}

export function onTcTx(cb: TxCb): () => void {
  txCbs.push(cb);
  return () => { const i = txCbs.indexOf(cb); if (i >= 0) txCbs.splice(i, 1); };
}

export function onTcStatus(cb: StatusCb): () => void {
  statusCbs.push(cb);
  return () => { const i = statusCbs.indexOf(cb); if (i >= 0) statusCbs.splice(i, 1); };
}
