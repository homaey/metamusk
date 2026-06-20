/**
 * DApps tab — WalletConnect v2 + TON Connect v2.
 *
 * UX closely mirrors Nova Wallet Android:
 *  - Session proposal: [Wallet icon] ←→ [DApp icon] header
 *  - AlertView (yellow/red) for chain warnings, missing accounts, etc.
 *  - Table view with key↔value rows for DApp metadata
 *  - Status dots + active badge on session cards
 *  - Confirm-before-disconnect modal (Android has this too)
 */
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import { useWallet } from "../wallet/store.js";
import { haptic, scanQr } from "../telegram.js";
import {
  wcInit, wcPair, wcApprove, wcReject, wcDisconnect, wcGetSessions,
  onWcProposal, onWcRequest, onWcSessionChange, wcHandleRequest, wcRespondError,
  WC_PROJECT_ID,
  type WcProposal, type WcRequest,
} from "../wallet/walletconnect.js";
import {
  tcInit, tcGetConnectLink, tcIsConnected, tcGetDappInfo,
  tcApproveConnect, tcRejectConnect, tcApproveTx, tcRejectTx, tcDisconnect, tcReset,
  onTcConnect, onTcTx, onTcStatus,
  type TcConnectRequest, type TcTxRequest,
} from "../wallet/tonconnect.js";
import { deriveEvm, deriveTon, evmSignerFromKey } from "@nova/chains";
import { mnemonicToSeed, zeroize } from "@nova/wallet-core";
import { getSessionMnemonic, getSessionPrivKey } from "../wallet/session.js";
import type { SessionTypes } from "@walletconnect/types";

type DAppsView = "main" | "wcPaste" | "wcProposal" | "wcRequest" | "tcApprove" | "tcTxApprove" | "disconnectConfirm";

// ── Address helpers ────────────────────────────────────────────────────────────

function getEvmAddress(): string {
  const privKey = getSessionPrivKey();
  if (privKey) {
    try { return evmSignerFromKey(privKey as `0x${string}`).address; } catch { return ""; }
  }
  const mnemonic = getSessionMnemonic();
  if (!mnemonic) return "";
  try {
    const seed = mnemonicToSeed(mnemonic);
    const acct = deriveEvm(seed, 0);
    zeroize(seed);
    return acct.address;
  } catch { return ""; }
}

function getTonAddress(): string | null {
  const mnemonic = getSessionMnemonic();
  if (!mnemonic) return null;
  try {
    const seed = mnemonicToSeed(mnemonic);
    const acct = deriveTon(seed, 0);
    zeroize(seed);
    return acct.address;
  } catch { return null; }
}

function getTonPublicKeyHex(): string {
  const mnemonic = getSessionMnemonic();
  if (!mnemonic) return "";
  try {
    const seed = mnemonicToSeed(mnemonic);
    const acct = deriveTon(seed, 0);
    const hex = Array.from(acct.publicKey, (b) => b.toString(16).padStart(2, "0")).join("");
    zeroize(seed);
    return hex;
  } catch { return ""; }
}

function short(addr: string) {
  return addr.length > 16 ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : addr;
}

// ── Sub-components ────────────────────────────────────────────────────────────

/** Nova Android-style AlertView: colored border, icon, message */
function AlertView({ type, children }: { type: "warning" | "error" | "info"; children: React.ReactNode }) {
  const icons = { warning: "⚠️", error: "🚫", info: "ℹ️" };
  return (
    <div className={`alert-view alert-${type}`}>
      <span className="alert-icon">{icons[type]}</span>
      <div className="alert-body">{children}</div>
    </div>
  );
}

/** Nova Android-style connection header: [wallet] ←——→ [dapp] */
function ConnectionHeader({ dappIconUrl, dappName }: { dappIconUrl?: string; dappName: string }) {
  return (
    <div className="conn-header">
      <div className="conn-side">
        <div className="conn-icon wallet-icon">
          <img src="/logo.svg" className="mark-small" alt="" />
        </div>
        <div className="conn-label">MetaMusk</div>
      </div>

      <div className="conn-bridge">
        <div className="conn-line" />
        <div className="conn-arrow">↔</div>
        <div className="conn-line" />
      </div>

      <div className="conn-side">
        {dappIconUrl ? (
          <img
            className="conn-icon dapp-favicon"
            src={dappIconUrl}
            alt=""
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
              (e.currentTarget.nextSibling as HTMLElement).style.display = "flex";
            }}
          />
        ) : null}
        <div className="conn-icon dapp-placeholder" style={{ display: dappIconUrl ? "none" : "flex" }}>🌐</div>
        <div className="conn-label">{dappName}</div>
      </div>
    </div>
  );
}

/** Key→value info table row */
function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className={`info-value${mono ? " mono" : ""}`}>{value}</span>
    </div>
  );
}

/** Active session card */
function SessionCard({
  iconUrl, name, url, onDisconnect,
}: { iconUrl?: string; name: string; url: string; onDisconnect: () => void }) {
  return (
    <div className="session-card">
      <div className="session-dot" />
      {iconUrl ? (
        <img className="session-icon" src={iconUrl} alt=""
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
      ) : (
        <div className="session-icon-placeholder">🌐</div>
      )}
      <div className="session-info">
        <div className="session-name">{name}</div>
        <div className="session-url">{url}</div>
        <div className="session-badge-active">● Active</div>
      </div>
      <button className="btn-disconnect" onClick={onDisconnect}>✕</button>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export function DApps() {
  const { t } = useTranslation();
  const { activeWalletType } = useWallet();

  const evmAddress = getEvmAddress();
  const tonAddress = getTonAddress();
  const tonPubKey = getTonPublicKeyHex();

  const [view, setView] = useState<DAppsView>("main");
  const [wcSessions, setWcSessions] = useState<SessionTypes.Struct[]>(wcGetSessions());
  const [wcProposal, setWcProposal] = useState<WcProposal | null>(null);
  const [wcRequest, setWcRequest] = useState<WcRequest | null>(null);
  const [tcConnected, setTcConnected] = useState(tcIsConnected());
  const [tcDapp, setTcDapp] = useState(tcGetDappInfo());
  const [tcPending, setTcPending] = useState<TcConnectRequest | null>(null);
  const [tcTxPending, setTcTxPending] = useState<TcTxRequest | null>(null);
  const [uriInput, setUriInput] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [disconnectTarget, setDisconnectTarget] = useState<{ topic: string; name: string } | null>(null);

  const refreshSessions = useCallback(() => setWcSessions(wcGetSessions()), []);

  // Init WalletConnect
  useEffect(() => {
    if (!WC_PROJECT_ID) return;
    wcInit();
  }, []);

  // Init TON Connect + generate QR
  useEffect(() => {
    tcInit();
    const link = tcGetConnectLink(window.location.origin);
    QRCode.toDataURL(link, { width: 220, margin: 2, color: { dark: "#1a1d24", light: "#ffffff" } })
      .then(setQrDataUrl)
      .catch(() => {});
  }, []);

  // WC subscriptions
  useEffect(() => {
    const unP = onWcProposal((p) => { setWcProposal(p); setView("wcProposal"); haptic("medium"); });
    const unR = onWcRequest((r) => { setWcRequest(r); setView("wcRequest"); haptic("medium"); });
    const unS = onWcSessionChange(refreshSessions);
    return () => { unP(); unR(); unS(); };
  }, [refreshSessions]);

  // TC subscriptions
  useEffect(() => {
    const unC = onTcConnect((req) => { setTcPending(req); setView("tcApprove"); haptic("medium"); });
    const unT = onTcTx((req) => { setTcTxPending(req); setView("tcTxApprove"); haptic("medium"); });
    const unS = onTcStatus(() => { setTcConnected(tcIsConnected()); setTcDapp(tcGetDappInfo()); });
    return () => { unC(); unT(); unS(); };
  }, []);

  // ── Actions ──────────────────────────────────────────────────────────────────

  const doPair = async (uri: string) => {
    if (!uri.trim()) return;
    setBusy(true); setError(null);
    try { await wcPair(uri.trim()); setUriInput(""); setView("main"); }
    catch (e) { setError(e instanceof Error ? e.message : "Pairing failed"); }
    finally { setBusy(false); }
  };

  const scanAndPair = async () => {
    try { const uri = await scanQr(t("dapps.scanPrompt")); if (uri) await doPair(uri); }
    catch { setView("wcPaste"); }
  };

  const approveWc = async () => {
    if (!wcProposal) return;
    setBusy(true); setError(null);
    try { await wcApprove(wcProposal, evmAddress); refreshSessions(); setWcProposal(null); setView("main"); }
    catch (e) { setError(e instanceof Error ? e.message : "Approval failed"); }
    finally { setBusy(false); }
  };

  const approveWcRequest = async () => {
    if (!wcRequest) return;
    setBusy(true); setError(null);
    try {
      const handled = await wcHandleRequest(wcRequest);
      if (!handled) await wcRespondError(wcRequest.topic, wcRequest.id, "Method not supported");
      setWcRequest(null); setView("main");
    }
    catch (e) { setError(e instanceof Error ? e.message : "Signing failed"); }
    finally { setBusy(false); }
  };

  const approveTc = async () => {
    if (!tonAddress) return;
    setBusy(true); setError(null);
    try { await tcApproveConnect(tonAddress, tonPubKey); setTcPending(null); setTcConnected(true); setTcDapp(tcGetDappInfo()); setView("main"); }
    catch (e) { setError(e instanceof Error ? e.message : "Connection failed"); }
    finally { setBusy(false); }
  };

  const approveTcTx = async () => {
    if (!tcTxPending) return;
    setBusy(true); setError(null);
    try { await tcApproveTx(tcTxPending.id, tcTxPending.messages); setTcTxPending(null); setView("main"); }
    catch (e) { setError(e instanceof Error ? e.message : "Transaction failed"); }
    finally { setBusy(false); }
  };

  const regenerateTcQr = () => {
    tcReset();
    const link = tcGetConnectLink(window.location.origin);
    QRCode.toDataURL(link, { width: 220, margin: 2, color: { dark: "#1a1d24", light: "#ffffff" } })
      .then(setQrDataUrl).catch(() => {});
    setTcConnected(false); setTcDapp(null);
  };

  // ── WC proposal view ──────────────────────────────────────────────────────────

  if (view === "wcProposal" && wcProposal) {
    const meta = wcProposal.params.proposer?.metadata;
    const required = wcProposal.params.requiredNamespaces ?? {};
    const optional = wcProposal.params.optionalNamespaces ?? {};
    const allChains = [
      ...Object.values(required).flatMap((ns) => (ns as { chains?: string[] }).chains ?? []),
      ...Object.values(optional).flatMap((ns) => (ns as { chains?: string[] }).chains ?? []),
    ];
    const unsupported = allChains.filter((c) => !c.startsWith("eip155"));
    const hasEvm = allChains.some((c) => c.startsWith("eip155")) || allChains.length === 0;

    return (
      <div className="dapps-sheet">
        <button className="sheet-close" onClick={() => { wcReject(wcProposal.id); setWcProposal(null); setView("main"); }}>✕</button>

        <ConnectionHeader dappIconUrl={meta?.icons?.[0]} dappName={meta?.name ?? "DApp"} />

        <h2 className="proposal-title">{t("dapps.wantAccess", { name: meta?.name ?? "DApp" })}</h2>
        <p className="proposal-sub">{t("dapps.wcAccessSub")}</p>

        <div className="info-table">
          <InfoRow label={t("dapps.app")} value={meta?.name ?? "—"} />
          <InfoRow label={t("dapps.url")} value={meta?.url ?? "—"} />
          <InfoRow label={t("dapps.chains")} value={allChains.length ? allChains.join(", ") : "EVM"} />
          <InfoRow label={t("dapps.account")} value={short(evmAddress)} mono />
        </div>

        {unsupported.length > 0 && (
          <AlertView type="warning">
            {t("dapps.unsupportedChains")}: {unsupported.join(", ")}
          </AlertView>
        )}
        {!hasEvm && (
          <AlertView type="error">{t("dapps.noEvmChain")}</AlertView>
        )}
        {!evmAddress && (
          <AlertView type="error">{t("dapps.noEvmAccount")}</AlertView>
        )}
        {error && <p className="error-text">{error}</p>}

        <div className="proposal-actions">
          <button className="btn secondary" onClick={() => { wcReject(wcProposal.id); setWcProposal(null); setView("main"); }}>
            {t("common.reject")}
          </button>
          <button className="btn" onClick={approveWc} disabled={busy || !evmAddress}>
            {busy ? <span className="spinner" /> : t("dapps.allow")}
          </button>
        </div>
      </div>
    );
  }

  // ── WC signing request ────────────────────────────────────────────────────────

  if (view === "wcRequest" && wcRequest) {
    const isTx = wcRequest.method === "eth_sendTransaction";
    const txParams = isTx ? (wcRequest.params as [{ to: string; value?: string }])[0] : null;
    const session = wcSessions.find((s) => s.topic === wcRequest.topic);
    const dappName = session?.peer.metadata.name ?? "DApp";
    const dappIcon = session?.peer.metadata.icons?.[0];

    return (
      <div className="dapps-sheet">
        <button className="sheet-close" onClick={() => { wcRespondError(wcRequest.topic, wcRequest.id).catch(() => {}); setWcRequest(null); setView("main"); }}>✕</button>

        <ConnectionHeader dappIconUrl={dappIcon} dappName={dappName} />

        <h2 className="proposal-title">{isTx ? t("dapps.txRequest") : t("dapps.signRequest")}</h2>

        <div className="info-table">
          <InfoRow label={t("dapps.app")} value={dappName} />
          <InfoRow label={t("dapps.method")} value={wcRequest.method} mono />
          <InfoRow label={t("dapps.chain")} value={wcRequest.chainId} />
          {txParams && <InfoRow label="To" value={short(txParams.to)} mono />}
          {txParams?.value && <InfoRow label="Value" value={`${(parseInt(txParams.value, 16) / 1e18).toFixed(6)} ETH`} />}
        </div>

        <AlertView type="warning">{t("dapps.signWarning")}</AlertView>

        {error && <p className="error-text">{error}</p>}
        <div className="proposal-actions">
          <button className="btn secondary" onClick={() => { wcRespondError(wcRequest.topic, wcRequest.id).catch(() => {}); setWcRequest(null); setView("main"); }}>
            {t("common.reject")}
          </button>
          <button className="btn" onClick={approveWcRequest} disabled={busy}>
            {busy ? <span className="spinner" /> : t("dapps.approve")}
          </button>
        </div>
      </div>
    );
  }

  // ── TON Connect approval ──────────────────────────────────────────────────────

  if (view === "tcApprove" && tcPending) {
    const { dappInfo } = tcPending;
    return (
      <div className="dapps-sheet">
        <button className="sheet-close" onClick={() => { tcRejectConnect().catch(() => {}); setTcPending(null); setView("main"); }}>✕</button>

        <ConnectionHeader dappIconUrl={dappInfo.iconUrl} dappName={dappInfo.name} />

        <h2 className="proposal-title">{t("dapps.wantAccess", { name: dappInfo.name })}</h2>
        <p className="proposal-sub">{t("dapps.tcAccessSub")}</p>

        <div className="info-table">
          <InfoRow label={t("dapps.app")} value={dappInfo.name} />
          <InfoRow label={t("dapps.url")} value={dappInfo.url} />
          <InfoRow label={t("dapps.account")} value={short(tonAddress ?? "—")} mono />
        </div>

        {!tonAddress && <AlertView type="error">{t("dapps.noTonAccount")}</AlertView>}
        {error && <p className="error-text">{error}</p>}

        <div className="proposal-actions">
          <button className="btn secondary" onClick={() => { tcRejectConnect().catch(() => {}); setTcPending(null); setView("main"); }}>
            {t("common.reject")}
          </button>
          <button className="btn" onClick={approveTc} disabled={busy || !tonAddress}>
            {busy ? <span className="spinner" /> : t("dapps.allow")}
          </button>
        </div>
      </div>
    );
  }

  // ── TON tx approval ───────────────────────────────────────────────────────────

  if (view === "tcTxApprove" && tcTxPending) {
    const msg = tcTxPending.messages[0];
    const dappName = tcDapp?.name ?? "TON DApp";
    return (
      <div className="dapps-sheet">
        <button className="sheet-close" onClick={() => { tcRejectTx(tcTxPending.id).catch(() => {}); setTcTxPending(null); setView("main"); }}>✕</button>

        <ConnectionHeader dappIconUrl={tcDapp?.iconUrl} dappName={dappName} />

        <h2 className="proposal-title">{t("dapps.tcTxTitle")}</h2>

        <div className="info-table">
          {msg && <>
            <InfoRow label={`${t("home.send")} ${t("dapps.to")}`} value={short(msg.address)} mono />
            <InfoRow label={t("home.send")} value={`${(Number(msg.amount) / 1e9).toFixed(6)} TON`} />
          </>}
          <InfoRow label={t("dapps.messages")} value={String(tcTxPending.messages.length)} />
        </div>

        <AlertView type="warning">{t("dapps.signWarning")}</AlertView>

        {error && <p className="error-text">{error}</p>}
        <div className="proposal-actions">
          <button className="btn secondary" onClick={() => { tcRejectTx(tcTxPending.id).catch(() => {}); setTcTxPending(null); setView("main"); }}>
            {t("common.reject")}
          </button>
          <button className="btn" onClick={approveTcTx} disabled={busy}>
            {busy ? <span className="spinner" /> : t("dapps.approve")}
          </button>
        </div>
      </div>
    );
  }

  // ── Paste WC URI ──────────────────────────────────────────────────────────────

  if (view === "wcPaste") {
    return (
      <div className="dapps-sheet">
        <div className="backbar">
          <button className="back" onClick={() => setView("main")}>‹</button>
          <span>{t("dapps.pasteUri")}</span>
        </div>
        <p className="lead">{t("dapps.pasteUriLead")}</p>
        <textarea className="uri-input" value={uriInput} onChange={(e) => setUriInput(e.target.value)} placeholder="wc:..." rows={4} />
        {error && <p className="error-text">{error}</p>}
        <button className="btn" onClick={() => doPair(uriInput)} disabled={busy || !uriInput.trim()}>
          {busy ? <span className="spinner" /> : t("dapps.connect")}
        </button>
        <button className="btn secondary" style={{ marginTop: 8 }} onClick={() => { setView("main"); setUriInput(""); setError(null); }}>
          {t("common.cancel")}
        </button>
      </div>
    );
  }

  // ── Disconnect confirmation (Nova Android always confirms destructive actions) ─

  if (view === "disconnectConfirm" && disconnectTarget) {
    return (
      <div className="dapps-sheet">
        <h2 className="proposal-title">{t("dapps.disconnectTitle")}</h2>
        <p className="lead">{t("dapps.disconnectLead", { name: disconnectTarget.name })}</p>
        <AlertView type="warning">{t("dapps.disconnectWarning")}</AlertView>
        <div className="proposal-actions" style={{ marginTop: 20 }}>
          <button className="btn secondary" onClick={() => { setDisconnectTarget(null); setView("main"); }}>{t("common.cancel")}</button>
          <button className="btn danger" onClick={async () => {
            if (disconnectTarget.topic === "__tc__") {
              await tcDisconnect(); setTcConnected(false); setTcDapp(null);
            } else {
              await wcDisconnect(disconnectTarget.topic); refreshSessions();
            }
            haptic("heavy"); setDisconnectTarget(null); setView("main");
          }}>
            {t("dapps.disconnect")}
          </button>
        </div>
      </div>
    );
  }

  // ── Main view ─────────────────────────────────────────────────────────────────

  const hasAnySessions = wcSessions.length > 0 || tcConnected;

  return (
    <div className="dapps-screen">

      {/* ── Active Sessions ── */}
      {hasAnySessions && (
        <section className="dapps-section">
          <h3 className="section-title">🔗 {t("dapps.activeSessions")}</h3>

          {wcSessions.map((s) => (
            <SessionCard
              key={s.topic}
              iconUrl={s.peer.metadata.icons?.[0]}
              name={s.peer.metadata.name}
              url={s.peer.metadata.url}
              onDisconnect={() => { setDisconnectTarget({ topic: s.topic, name: s.peer.metadata.name }); setView("disconnectConfirm"); }}
            />
          ))}

          {tcConnected && tcDapp && (
            <SessionCard
              iconUrl={tcDapp.iconUrl}
              name={tcDapp.name}
              url={tcDapp.url}
              onDisconnect={() => { setDisconnectTarget({ topic: "__tc__", name: tcDapp.name }); setView("disconnectConfirm"); }}
            />
          )}
        </section>
      )}

      {/* ── WalletConnect — only shown when Project ID is configured ── */}
      {WC_PROJECT_ID && (
        <section className="dapps-section">
          <div className="section-header">
            <div className="section-protocol-icon wc-icon">
              <span>🔗</span>
            </div>
            <div>
              <h3 className="section-title" style={{ margin: 0 }}>WalletConnect</h3>
              <p className="section-lead" style={{ margin: "2px 0 0" }}>v2 · EVM</p>
            </div>
          </div>
          <p className="section-lead" style={{ marginTop: 12 }}>{t("dapps.wcLead")}</p>
          <div className="dapp-connect-btns">
            <button className="btn" onClick={scanAndPair}>
              <span style={{ marginRight: 6 }}>📷</span>{t("dapps.scanQr")}
            </button>
            <button className="btn secondary" onClick={() => { setView("wcPaste"); setError(null); }}>
              {t("dapps.pasteUri")}
            </button>
          </div>
        </section>
      )}

      {/* ── TON Connect ── */}
      {activeWalletType === "mnemonic" ? (
        <section className="dapps-section">
          <div className="section-header">
            <div className="section-protocol-icon tc-icon">
              <span>💎</span>
            </div>
            <div>
              <h3 className="section-title" style={{ margin: 0 }}>TON Connect</h3>
              <p className="section-lead" style={{ margin: "2px 0 0" }}>v2 · TON</p>
            </div>
          </div>

          {tcConnected ? (
            <AlertView type="info">{t("dapps.tcAlreadyConnected")}</AlertView>
          ) : (
            <>
              <p className="section-lead" style={{ marginTop: 12 }}>{t("dapps.tcLead")}</p>
              {qrDataUrl ? (
                <div className="tc-qr-wrap">
                  <div className="tc-qr-frame">
                    <img src={qrDataUrl} className="tc-qr" alt="TON Connect QR" />
                    <div className="tc-qr-logo">💎</div>
                  </div>
                  <p className="tc-qr-hint">{t("dapps.tcScanHint")}</p>
                </div>
              ) : (
                <div className="skeleton tc-qr-skel" />
              )}
              <button className="btn secondary" style={{ marginTop: 12 }} onClick={regenerateTcQr}>
                🔄 {t("dapps.tcRefresh")}
              </button>
            </>
          )}
        </section>
      ) : (
        <section className="dapps-section">
          <div className="section-header">
            <div className="section-protocol-icon tc-icon"><span>💎</span></div>
            <div>
              <h3 className="section-title" style={{ margin: 0 }}>TON Connect</h3>
              <p className="section-lead" style={{ margin: "2px 0 0" }}>v2 · TON</p>
            </div>
          </div>
          <AlertView type="info">{t("dapps.privkeyNoTon")}</AlertView>
        </section>
      )}

      {/* Empty hint when nothing is going on */}
      {!hasAnySessions && (
        <div className="dapps-empty">
          <div className="dapps-empty-icon">🔌</div>
          <p>{t("dapps.emptyHint")}</p>
        </div>
      )}
    </div>
  );
}
