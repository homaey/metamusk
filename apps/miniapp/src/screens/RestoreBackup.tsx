import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWallet } from "../wallet/store.js";
import { restoreCloudBackup } from "../wallet/backup.js";
import { haptic } from "../telegram.js";

interface Props {
  onDone: () => void;
  onBack: () => void;
}

export function RestoreBackup({ onDone, onBack }: Props) {
  const { t } = useTranslation();
  const { restoreFromBackup } = useWallet();
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const doRestore = async () => {
    if (!password) return;
    setBusy(true); setError(null);
    try {
      const storeJson = await restoreCloudBackup(password);
      await restoreFromBackup(storeJson);
      haptic("heavy");
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("backup.restoreFailed"));
      haptic("heavy");
    } finally { setBusy(false); }
  };

  return (
    <div className="screen center">
      <div className="topbar">
        <button className="back" onClick={onBack}>‹</button>
      </div>

      <div className="brand big">
        <img src="/logo.svg" className="mark" alt="" />
        <h1>MetaMusk</h1>
      </div>

      <h2 style={{ marginBottom: 6 }}>☁️ {t("backup.restoreTitle")}</h2>
      <p className="lead">{t("backup.restoreLead")}</p>

      <div className="pw-field-wrap" style={{ marginTop: 20 }}>
        <input
          type="password"
          className="pw-field"
          placeholder={t("backup.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") doRestore(); }}
          autoFocus
        />
      </div>

      {error && <p className="error-text" style={{ marginTop: 10 }}>{error}</p>}

      <div className="stack" style={{ marginTop: 20 }}>
        <button className="btn" onClick={doRestore} disabled={!password || busy}>
          {busy ? "…" : t("backup.restoreBtn")}
        </button>
        <button className="btn secondary" onClick={onBack}>{t("common.cancel")}</button>
      </div>
    </div>
  );
}
