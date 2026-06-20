import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWallet } from "../wallet/store.js";
import { PinPad } from "../components/PinPad.js";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { haptic } from "../telegram.js";

export function Unlock() {
  const { t } = useTranslation();
  const { unlock, error, clearError, reset } = useWallet();
  const [resetSignal, setResetSignal] = useState(0);

  return (
    <div className="screen center">
      <div className="topbar"><LanguageSwitcher /></div>
      <div className="brand big"><img src="/logo.svg" className="mark" alt="" /><h1>MetaMusk</h1></div>
      <p className="lead">{t("unlock.lead")}</p>
      <PinPad resetSignal={resetSignal} onComplete={async (pin) => {
        const ok = await unlock(pin);
        if (!ok) { haptic("heavy"); setResetSignal((n) => n + 1); }
      }} />
      {error && <p className="error-text" onAnimationEnd={clearError}>{t("unlock.wrong")}</p>}
      <button className="link-btn" onClick={() => {
        if (confirm(t("unlock.forgot"))) void reset();
      }}>{t("unlock.forgot")}</button>
    </div>
  );
}
