/**
 * Settings sheet: wallet manager + key export + delete.
 * All key exports require PIN re-entry (gated reveal).
 * Wallet manager: switch between wallets, add new/import, remove, rename.
 */
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWallet, peekMnemonic } from "../wallet/store.js";
import { deriveEvm, deriveTon, deriveSolana, deriveBitcoin } from "@nova/chains";
import { mnemonicToSeed, zeroize } from "@nova/wallet-core";
import { haptic, isCloudStorageAvailable } from "../telegram.js";
import { hasCloudBackup, createCloudBackup, deleteCloudBackup, validateBackupPassword } from "../wallet/backup.js";
import { PinPad } from "../components/PinPad.js";
import { CreateWallet } from "./CreateWallet.js";
import { ImportWallet } from "./ImportWallet.js";

type View = "menu" | "wallets" | "addWallet" | "pin" | "phrase" | "keys" | "switchPin" | "removeConfirm" | "backup" | "backupCreate" | "backupDelete";

interface Props { onClose: () => void }

export function Settings({ onClose }: Props) {
  const { t } = useTranslation();
  const {
    unlock, reset, wallets, activeWalletId, activeWalletType,
    switchWallet, renameWallet, dumpStore,
  } = useWallet();
  const [view, setView] = useState<View>("menu");
  const [target, setTarget] = useState<"phrase" | "keys">("phrase");
  const [pinError, setPinError] = useState(false);
  const [phrase, setPhrase] = useState<string | null>(null);
  const [keys, setKeys] = useState<{ label: string; key: string }[] | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [switchTarget, setSwitchTarget] = useState<string | null>(null);
  const [addMode, setAddMode] = useState<"create" | "import" | null>(null);
  const [editingName, setEditingName] = useState<{ id: string; name: string } | null>(null);

  const isMnemonic = activeWalletType === "mnemonic";

  // Backup state
  const cloudAvailable = isCloudStorageAvailable();
  const [backupExists, setBackupExists] = useState(false);
  const [backupPw, setBackupPw] = useState("");
  const [backupPwConfirm, setBackupPwConfirm] = useState("");
  const [backupBusy, setBackupBusy] = useState(false);
  const [backupError, setBackupError] = useState<string | null>(null);

  useEffect(() => { hasCloudBackup().then(setBackupExists); }, []);

  const pwIssues = view === "backupCreate" ? validateBackupPassword(backupPw, backupPwConfirm) : [];
  const pwOk = pwIssues.length === 0 && backupPw.length >= 8;

  const requestExport = (what: "phrase" | "keys") => {
    setTarget(what); setPinError(false); setView("pin");
  };

  const onPin = async (pin: string) => {
    const ok = await unlock(pin);
    if (!ok) { setPinError(true); haptic("heavy"); return; }
    setPinError(false);
    if (target === "phrase") {
      const mn = peekMnemonic();
      if (!mn) return;
      setPhrase(mn);
      setView("phrase");
    } else {
      const mn = peekMnemonic();
      if (mn) {
        const seed = mnemonicToSeed(mn);
        try {
          const evmAcct = deriveEvm(seed, 0);
          const tonAcct = deriveTon(seed, 0);
          const solAcct = deriveSolana(seed, 0);
          const btcAcct = deriveBitcoin(seed, 0);
          setKeys([
            { label: "EVM (Ethereum, BSC, Polygon…)", key: `0x${Buffer.from(evmAcct.privateKey).toString("hex")}` },
            { label: "TON", key: Buffer.from(tonAcct.privateKey).toString("hex") },
            { label: "Solana", key: Buffer.from(solAcct.privateKey).toString("hex") },
            { label: "Bitcoin", key: Buffer.from(btcAcct.privateKey).toString("hex") },
          ]);
          zeroize(evmAcct.privateKey, tonAcct.privateKey, solAcct.privateKey, btcAcct.privateKey);
        } finally { zeroize(seed); }
      } else {
        // Privkey wallet — show the stored EVM key
        // It's already accessible via session after unlock
        const { getSessionPrivKey } = await import("../wallet/session.js");
        const pk = getSessionPrivKey();
        if (pk) setKeys([{ label: "EVM Private Key", key: pk }]);
      }
      setView("keys");
    }
  };

  const onSwitchPin = async (pin: string) => {
    if (!switchTarget) return;
    const ok = await switchWallet(switchTarget, pin);
    if (!ok) { setPinError(true); haptic("heavy"); return; }
    haptic("heavy");
    setSwitchTarget(null);
    setView("wallets");
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      haptic("medium"); setCopied(label);
      setTimeout(() => setCopied(null), 1800);
    } catch { /* denied */ }
  };

  const handleReset = async () => { await reset(); onClose(); };

  // Add wallet flows
  if (addMode === "create") {
    return (
      <div className="sheet-backdrop" onClick={onClose}>
        <div className="sheet settings-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sheet-handle" />
          <CreateWallet onDone={() => { setAddMode(null); setView("wallets"); }} onBack={() => setAddMode(null)} />
        </div>
      </div>
    );
  }
  if (addMode === "import") {
    return (
      <div className="sheet-backdrop" onClick={onClose}>
        <div className="sheet settings-sheet" onClick={(e) => e.stopPropagation()}>
          <div className="sheet-handle" />
          <ImportWallet onDone={() => { setAddMode(null); setView("wallets"); }} onBack={() => setAddMode(null)} />
        </div>
      </div>
    );
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet settings-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />

        {/* ── Main menu ────────────────────────────────────────────────── */}
        {view === "menu" && (
          <>
            <h2 className="sheet-title">{t("settings.title")}</h2>
            <div className="settings-list">
              <button className="settings-row" onClick={() => { haptic("light"); setView("wallets"); }}>
                <span className="settings-icon">👛</span>
                <div className="settings-label">
                  <div>{t("wallets.title")}</div>
                  <div className="settings-sub">{wallets.length} {t("wallets.count")}</div>
                </div>
                <span className="settings-chevron">›</span>
              </button>

              {isMnemonic && (
                <button className="settings-row" onClick={() => { haptic("light"); requestExport("phrase"); }}>
                  <span className="settings-icon">🔑</span>
                  <div className="settings-label">
                    <div>{t("settings.exportPhrase")}</div>
                    <div className="settings-sub">{t("settings.exportPhraseSub")}</div>
                  </div>
                  <span className="settings-chevron">›</span>
                </button>
              )}

              <button className="settings-row" onClick={() => { haptic("light"); requestExport("keys"); }}>
                <span className="settings-icon">🗝️</span>
                <div className="settings-label">
                  <div>{t("settings.exportKeys")}</div>
                  <div className="settings-sub">{t("settings.exportKeysSub")}</div>
                </div>
                <span className="settings-chevron">›</span>
              </button>

              {cloudAvailable && (
                <button className="settings-row" onClick={() => { haptic("light"); setBackupError(null); setView("backup"); }}>
                  <span className="settings-icon">☁️</span>
                  <div className="settings-label">
                    <div>{t("backup.title")}</div>
                    <div className="settings-sub">{backupExists ? t("backup.statusOk") : t("backup.statusNone")}</div>
                  </div>
                  <span className="settings-chevron">›</span>
                </button>
              )}

              <button className="settings-row danger" onClick={() => { haptic("heavy"); setConfirmReset(true); }}>
                <span className="settings-icon">🗑️</span>
                <div className="settings-label">
                  <div>{t("settings.deleteWallet")}</div>
                  <div className="settings-sub">{t("settings.deleteWalletSub")}</div>
                </div>
                <span className="settings-chevron">›</span>
              </button>
            </div>

            {confirmReset && (
              <div className="banner banner-danger" style={{ marginTop: 14 }}>
                <p>{t("settings.deleteConfirm")}</p>
                <div className="stack" style={{ gap: 8, marginTop: 10 }}>
                  <button className="btn danger" onClick={handleReset}>{t("settings.deleteConfirmBtn")}</button>
                  <button className="btn secondary" onClick={() => setConfirmReset(false)}>{t("common.cancel")}</button>
                </div>
              </div>
            )}

            <button className="btn secondary" style={{ marginTop: 14 }} onClick={onClose}>{t("common.done")}</button>
          </>
        )}

        {/* ── Wallet manager ───────────────────────────────────────────── */}
        {view === "wallets" && (
          <>
            <div className="backbar">
              <button className="back" onClick={() => setView("menu")}>‹</button>
              <span>{t("wallets.title")}</span>
            </div>

            <div className="settings-list">
              {wallets.map((w) => (
                <div key={w.id} className={`wallet-entry${w.id === activeWalletId ? " active" : ""}`}>
                  {editingName?.id === w.id ? (
                    <input
                      className="wallet-name-input"
                      value={editingName.name}
                      autoFocus
                      onChange={(e) => setEditingName({ id: w.id, name: e.target.value })}
                      onBlur={async () => {
                        if (editingName.name.trim()) {
                          await renameWallet(w.id, editingName.name.trim());
                        }
                        setEditingName(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        if (e.key === "Escape") setEditingName(null);
                      }}
                    />
                  ) : (
                    <span className="wallet-entry-name" onDoubleClick={() => setEditingName({ id: w.id, name: w.name })}>
                      {w.type === "privkey" ? "🗝️" : "🔑"} {w.name}
                    </span>
                  )}
                  {w.id === activeWalletId ? (
                    <span className="wallet-check">✓</span>
                  ) : (
                    <button
                      className="btn secondary"
                      style={{ padding: "4px 12px", fontSize: 12 }}
                      onClick={() => {
                        setSwitchTarget(w.id);
                        setPinError(false);
                        setView("switchPin");
                      }}
                    >
                      {t("wallets.use")}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn" style={{ flex: 1 }} onClick={() => setAddMode("create")}>
                + {t("wallets.create")}
              </button>
              <button className="btn secondary" style={{ flex: 1 }} onClick={() => setAddMode("import")}>
                {t("wallets.import")}
              </button>
            </div>

            <button className="btn secondary" style={{ marginTop: 10 }} onClick={() => setView("menu")}>{t("common.done")}</button>
          </>
        )}

        {/* ── Switch wallet PIN ─────────────────────────────────────────── */}
        {view === "switchPin" && (
          <>
            <div className="backbar">
              <button className="back" onClick={() => setView("wallets")}>‹</button>
              <span>{t("wallets.enterPin")}</span>
            </div>
            <p className="lead">{t("wallets.enterPinLead")}</p>
            {pinError && <p className="error-text">{t("unlock.wrong")}</p>}
            <PinPad onComplete={onSwitchPin} />
            <button className="btn secondary" style={{ marginTop: 14 }} onClick={() => setView("wallets")}>{t("common.cancel")}</button>
          </>
        )}

        {/* ── Export PIN ───────────────────────────────────────────────── */}
        {view === "pin" && (
          <>
            <h2 className="sheet-title">{t("settings.confirmPin")}</h2>
            <p className="lead">{t("settings.confirmPinLead")}</p>
            {pinError && <p className="error-text">{t("unlock.wrong")}</p>}
            <PinPad onComplete={onPin} />
            <button className="btn secondary" style={{ marginTop: 14 }} onClick={() => setView("menu")}>{t("common.cancel")}</button>
          </>
        )}

        {/* ── Phrase export ─────────────────────────────────────────────── */}
        {view === "phrase" && phrase && (
          <>
            <h2 className="sheet-title">{t("settings.exportPhrase")}</h2>
            <div className="banner banner-danger" style={{ marginBottom: 14 }}>⚠️ {t("settings.phraseWarning")}</div>
            <div className="seed-grid" style={{ marginBottom: 16 }}>
              {phrase.split(" ").map((w, i) => (
                <div key={i} className="seed-word"><span className="num">{i + 1}</span>{w}</div>
              ))}
            </div>
            <button className="btn" onClick={() => copy(phrase, "phrase")}>
              {copied === "phrase" ? "✓ Copied" : t("settings.copyPhrase")}
            </button>
            <button className="btn secondary" style={{ marginTop: 8 }} onClick={() => { setPhrase(null); setView("menu"); }}>{t("common.done")}</button>
          </>
        )}

        {/* ── Keys export ──────────────────────────────────────────────── */}
        {view === "keys" && keys && (
          <>
            <h2 className="sheet-title">{t("settings.exportKeys")}</h2>
            <div className="banner banner-danger" style={{ marginBottom: 14 }}>⚠️ {t("settings.keyWarning")}</div>
            {keys.map((k) => (
              <div key={k.label} className="key-export-row">
                <div className="key-export-label">{k.label}</div>
                <div className="key-export-value">{k.key}</div>
                <button className="btn secondary" style={{ marginTop: 6, padding: "8px 14px", fontSize: 13 }} onClick={() => copy(k.key, k.label)}>
                  {copied === k.label ? "✓ Copied" : t("settings.copyKey")}
                </button>
              </div>
            ))}
            <button className="btn secondary" style={{ marginTop: 12 }} onClick={() => { setKeys(null); setView("menu"); }}>{t("common.done")}</button>
          </>
        )}

        {/* ── Cloud Backup overview ─────────────────────────────────────── */}
        {view === "backup" && (
          <>
            <div className="backbar">
              <button className="back" onClick={() => setView("menu")}>‹</button>
              <span>{t("backup.title")}</span>
            </div>
            <div className={`backup-status-card ${backupExists ? "ok" : "warn"}`}>
              <span className="backup-status-icon">{backupExists ? "✅" : "⚠️"}</span>
              <div>
                <div className="backup-status-label">{backupExists ? t("backup.statusOk") : t("backup.statusNone")}</div>
                <div className="backup-status-sub">{t("backup.statusSub")}</div>
              </div>
            </div>
            <p className="lead" style={{ marginTop: 12 }}>{t("backup.lead")}</p>
            <div className="stack" style={{ marginTop: 16 }}>
              <button className="btn" onClick={() => { setBackupPw(""); setBackupPwConfirm(""); setBackupError(null); setView("backupCreate"); }}>
                {backupExists ? t("backup.update") : t("backup.create")}
              </button>
              {backupExists && (
                <button className="btn secondary danger" onClick={() => setView("backupDelete")}>{t("backup.delete")}</button>
              )}
            </div>
            <button className="btn secondary" style={{ marginTop: 10 }} onClick={() => setView("menu")}>{t("common.done")}</button>
          </>
        )}

        {/* ── Cloud Backup create / update ──────────────────────────────── */}
        {view === "backupCreate" && (
          <>
            <div className="backbar">
              <button className="back" onClick={() => setView("backup")}>‹</button>
              <span>{backupExists ? t("backup.update") : t("backup.create")}</span>
            </div>
            <p className="lead">{t("backup.createLead")}</p>

            <div className="pw-field-wrap">
              <input type="password" className="pw-field" placeholder={t("backup.password")} value={backupPw} onChange={(e) => setBackupPw(e.target.value)} />
            </div>
            <div className="pw-field-wrap">
              <input type="password" className="pw-field" placeholder={t("backup.confirmPassword")} value={backupPwConfirm} onChange={(e) => setBackupPwConfirm(e.target.value)} />
            </div>

            {/* Validation checklist (inspired by Nova Android) */}
            <div className="pw-checklist">
              {[
                { key: "min8", label: t("backup.checkMin8") },
                { key: "hasLetters", label: t("backup.checkLetters") },
                { key: "hasNumbers", label: t("backup.checkNumbers") },
                { key: "match", label: t("backup.checkMatch") },
              ].map(({ key, label }) => (
                <div key={key} className={`pw-check-row ${!pwIssues.includes(key) && backupPw ? "met" : ""}`}>
                  <span className="pw-check-dot" />{label}
                </div>
              ))}
            </div>

            {backupError && <p className="error-text">{backupError}</p>}

            <button
              className="btn"
              style={{ marginTop: 16 }}
              disabled={!pwOk || backupBusy}
              onClick={async () => {
                setBackupBusy(true); setBackupError(null);
                try {
                  const storeJson = await dumpStore();
                  if (!storeJson) throw new Error("Nothing to backup");
                  await createCloudBackup(storeJson, backupPw);
                  setBackupExists(true);
                  haptic("heavy");
                  setView("backup");
                } catch (e) {
                  setBackupError(e instanceof Error ? e.message : "Backup failed");
                } finally { setBackupBusy(false); }
              }}
            >
              {backupBusy ? "…" : t("backup.save")}
            </button>
            <button className="btn secondary" style={{ marginTop: 8 }} onClick={() => setView("backup")}>{t("common.cancel")}</button>
          </>
        )}

        {/* ── Cloud Backup delete ───────────────────────────────────────── */}
        {view === "backupDelete" && (
          <>
            <div className="backbar">
              <button className="back" onClick={() => setView("backup")}>‹</button>
              <span>{t("backup.delete")}</span>
            </div>
            <div className="banner banner-danger" style={{ marginBottom: 14 }}>⚠️ {t("backup.deleteWarning")}</div>
            {backupError && <p className="error-text">{backupError}</p>}
            <div className="stack" style={{ marginTop: 16 }}>
              <button className="btn danger" onClick={async () => {
                setBackupBusy(true); setBackupError(null);
                try { await deleteCloudBackup(); setBackupExists(false); haptic("heavy"); setView("backup"); }
                catch (e) { setBackupError(e instanceof Error ? e.message : "Delete failed"); }
                finally { setBackupBusy(false); }
              }} disabled={backupBusy}>{backupBusy ? "…" : t("backup.deleteConfirmBtn")}</button>
              <button className="btn secondary" onClick={() => setView("backup")}>{t("common.cancel")}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
