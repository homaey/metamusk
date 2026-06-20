import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { haptic, isCloudStorageAvailable } from "../telegram.js";
import { hasCloudBackup } from "../wallet/backup.js";

interface Props {
  onCreate: () => void;
  onImport: () => void;
  onRestore: () => void;
}

export function Welcome({ onCreate, onImport, onRestore }: Props) {
  const { t } = useTranslation();
  const cloudAvailable = isCloudStorageAvailable();
  const [hasBackup, setHasBackup] = useState(false);

  useEffect(() => {
    if (cloudAvailable) hasCloudBackup().then(setHasBackup);
  }, [cloudAvailable]);

  return (
    <div className="screen center">
      <div className="topbar"><LanguageSwitcher /></div>
      <div className="brand big">
        <img src="/logo.svg" className="mark" alt="" />
        <h1>MetaMusk</h1>
      </div>
      <p className="lead">{t("welcome.lead")}</p>

      <ul className="bullets">
        <li>{t("bullets.keys")}</li>
        <li>{t("bullets.chains")}</li>
        <li>{t("bullets.warnings")}</li>
      </ul>

      <div className="stack">
        <button className="btn" onClick={() => { haptic("medium"); onCreate(); }}>{t("welcome.create")}</button>
        <button className="btn secondary" onClick={() => { haptic("light"); onImport(); }}>{t("welcome.import")}</button>
        {cloudAvailable && hasBackup && (
          <button className="btn secondary" onClick={() => { haptic("light"); onRestore(); }}>
            ☁️ {t("welcome.restore")}
          </button>
        )}
      </div>

      <p className="fineprint">{t("welcome.fineprint")}</p>
    </div>
  );
}
