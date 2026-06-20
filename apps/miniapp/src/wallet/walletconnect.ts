/**
 * WalletConnect v2 — wallet-side integration.
 *
 * Non-custodial: all signing happens in sign.ts client-side.
 * The WC relay only carries encrypted session messages; no keys leave the device.
 *
 * Requires VITE_WC_PROJECT_ID env variable (get one at cloud.walletconnect.com).
 *
 * Heavy dependencies are dynamic-imported so they only load when the user
 * actually opens the DApps tab (React.lazy chunk boundary).
 */
/// <reference types="vite/client" />
import type { SessionTypes, ProposalTypes } from "@walletconnect/types";
import { signAndSend } from "./sign.js";
import { getSessionMnemonic, getSessionPrivKey } from "./session.js";
import { mnemonicToSeed, zeroize } from "@nova/wallet-core";
import { deriveEvm, evmSigner, evmSignerFromKey, NETWORKS } from "@nova/chains";

export const WC_PROJECT_ID = (import.meta.env.VITE_WC_PROJECT_ID as string | undefined) ?? "";

const METADATA = {
  name: "MetaMusk",
  description: "Non-custodial Telegram wallet",
  url: typeof window !== "undefined" ? window.location.origin : "https://metamusk.app",
  icons: [] as string[],
};

// ── Singleton client ──────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: any | null = null;

export type WcProposal = {
  id: number;
  params: ProposalTypes.Struct;
};
export type WcRequest = {
  topic: string;
  id: number;
  chainId: string;
  method: string;
  params: unknown[];
};

type ProposalCb = (p: WcProposal) => void;
type RequestCb = (r: WcRequest) => void;
type SessionChangeCb = () => void;

const onProposal: ProposalCb[] = [];
const onRequest: RequestCb[] = [];
const onSessionChange: SessionChangeCb[] = [];

// ── Init ──────────────────────────────────────────────────────────────────────

export async function wcInit(): Promise<boolean> {
  if (client) return true;
  if (!WC_PROJECT_ID) {
    console.warn("[WC] VITE_WC_PROJECT_ID not set — WalletConnect disabled.");
    return false;
  }
  try {
    const { Core } = await import("@walletconnect/core");
    const { Web3Wallet: W3W } = await import("@walletconnect/web3wallet");
    // Cast core to any to bypass duplicate-package type conflict (runtime is fine)
    const core = new Core({ projectId: WC_PROJECT_ID }) as unknown as Parameters<typeof W3W.init>[0]["core"];
    client = await W3W.init({ core, metadata: METADATA });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client.on("session_proposal", (proposal: any) => {
      onProposal.forEach((cb) => cb({ id: proposal.id, params: proposal.params }));
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    client.on("session_request", (event: any) => {
      const { topic, id, params } = event;
      const { request, chainId } = params;
      onRequest.forEach((cb) =>
        cb({ topic, id, chainId, method: request.method, params: request.params as unknown[] }),
      );
    });

    client.on("session_delete", () => onSessionChange.forEach((cb) => cb()));
    client.on("session_expire", () => onSessionChange.forEach((cb) => cb()));

    return true;
  } catch (err) {
    console.error("[WC] init failed", err);
    return false;
  }
}

// ── Pairing ───────────────────────────────────────────────────────────────────

export async function wcPair(uri: string): Promise<void> {
  if (!client) await wcInit();
  if (!client) throw new Error("WalletConnect not available");
  await client.core.pairing.pair({ uri });
}

// ── Session management ────────────────────────────────────────────────────────

export async function wcApprove(proposal: WcProposal, evmAddress: string): Promise<void> {
  if (!client) throw new Error("WC not initialized");
  const { requiredNamespaces, optionalNamespaces = {} } = proposal.params;
  const namespaces: SessionTypes.Namespaces = {};

  for (const [key, ns] of Object.entries({ ...requiredNamespaces, ...optionalNamespaces }) as [string, ProposalTypes.RequiredNamespace][]) {
    if (key === "eip155") {
      const chains = ns.chains ?? ["eip155:1"];
      namespaces[key] = {
        accounts: chains.map((c) => `${c}:${evmAddress}`),
        methods: ns.methods ?? [],
        events: ns.events ?? [],
      };
    }
  }

  if (!namespaces["eip155"]) {
    namespaces["eip155"] = {
      accounts: [`eip155:1:${evmAddress}`],
      methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData_v4", "eth_sign"],
      events: ["accountsChanged", "chainChanged"],
    };
  }

  await client.approveSession({ id: proposal.id, namespaces });
  onSessionChange.forEach((cb) => cb());
}

export async function wcReject(proposalId: number): Promise<void> {
  if (!client) return;
  await client.rejectSession({ id: proposalId, reason: { code: 4001, message: "User rejected the request." } });
}

export async function wcDisconnect(topic: string): Promise<void> {
  if (!client) return;
  try {
    await client.disconnectSession({ topic, reason: { code: 6000, message: "User disconnected" } });
  } catch { /* already gone */ }
  onSessionChange.forEach((cb) => cb());
}

export function wcGetSessions(): SessionTypes.Struct[] {
  if (!client) return [];
  return Object.values(client.getActiveSessions()) as SessionTypes.Struct[];
}

// ── Request handling ──────────────────────────────────────────────────────────

export async function wcRespond(topic: string, id: number, result: unknown): Promise<void> {
  if (!client) return;
  await client.respondSessionRequest({ topic, response: { id, jsonrpc: "2.0", result } });
}

export async function wcRespondError(topic: string, id: number, message = "User rejected"): Promise<void> {
  if (!client) return;
  await client.respondSessionRequest({
    topic,
    response: { id, jsonrpc: "2.0", error: { code: 4001, message } },
  });
}

export async function wcHandleRequest(req: WcRequest): Promise<boolean> {
  const mnemonic = getSessionMnemonic();
  const privKey = getSessionPrivKey();
  if (!mnemonic && !privKey) {
    await wcRespondError(req.topic, req.id, "Wallet locked");
    return true;
  }

  try {
    let signer: ReturnType<typeof evmSigner>;
    if (privKey) {
      signer = evmSignerFromKey(privKey as `0x${string}`);
    } else {
      const seed = mnemonicToSeed(mnemonic!);
      const acct = deriveEvm(seed, 0);
      signer = evmSigner(acct);
      zeroize(seed);
    }

    switch (req.method) {
      case "personal_sign": {
        const [message] = req.params as [string, string];
        const sig = await signer.signMessage({ message: { raw: message as `0x${string}` } });
        await wcRespond(req.topic, req.id, sig);
        return true;
      }

      case "eth_sign": {
        const [, message] = req.params as [string, string];
        const sig = await signer.signMessage({ message: { raw: message as `0x${string}` } });
        await wcRespond(req.topic, req.id, sig);
        return true;
      }

      case "eth_signTypedData_v4": {
        const [, typedDataJson] = req.params as [string, string];
        const typed = JSON.parse(typedDataJson) as {
          domain: Parameters<typeof signer.signTypedData>[0]["domain"];
          types: Parameters<typeof signer.signTypedData>[0]["types"];
          primaryType: Parameters<typeof signer.signTypedData>[0]["primaryType"];
          message: Parameters<typeof signer.signTypedData>[0]["message"];
        };
        const sig = await signer.signTypedData({
          domain: typed.domain,
          types: typed.types,
          primaryType: typed.primaryType,
          message: typed.message,
        });
        await wcRespond(req.topic, req.id, sig);
        return true;
      }

      case "eth_sendTransaction": {
        const [txParams] = req.params as [{ from: string; to: string; value?: string; data?: string; gas?: string }];
        const chainNum = parseInt(req.chainId.split(":")[1] ?? "1");
        const networkId = Object.keys(NETWORKS).find(
          (k) => (NETWORKS[k] as { chainId?: number }).chainId === chainNum,
        ) ?? "evm:1";
        const result = await signAndSend({
          family: "evm",
          networkId,
          to: txParams.to,
          amount: "0",
        });
        if (result.status === "sent" && result.hash) {
          await wcRespond(req.topic, req.id, result.hash);
        } else {
          await wcRespondError(req.topic, req.id, result.error ?? "Transaction failed");
        }
        return true;
      }

      default:
        return false;
    }
  } catch (err) {
    await wcRespondError(req.topic, req.id, err instanceof Error ? err.message : "Error");
    return true;
  }
}

// ── Event subscriptions ───────────────────────────────────────────────────────

export function onWcProposal(cb: ProposalCb): () => void {
  onProposal.push(cb);
  return () => { const i = onProposal.indexOf(cb); if (i >= 0) onProposal.splice(i, 1); };
}

export function onWcRequest(cb: RequestCb): () => void {
  onRequest.push(cb);
  return () => { const i = onRequest.indexOf(cb); if (i >= 0) onRequest.splice(i, 1); };
}

export function onWcSessionChange(cb: SessionChangeCb): () => void {
  onSessionChange.push(cb);
  return () => { const i = onSessionChange.indexOf(cb); if (i >= 0) onSessionChange.splice(i, 1); };
}
