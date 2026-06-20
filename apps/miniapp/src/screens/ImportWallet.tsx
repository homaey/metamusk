import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isValidMnemonic, normalizeMnemonic, evmAddressFromPrivateKey } from "@nova/wallet-core";
import { useWallet } from "../wallet/store.js";
import { PinPad } from "../components/PinPad.js";
import { haptic } from "../telegram.js";

type Mode = "phrase" | "privkey";
type Step = "input" | "pin";

export function ImportWallet({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const { t } = useTranslation();
  const { importMnemonic, importPrivKey } = useWallet();
  const [mode, setMode] = useState<Mode>("phrase");

  // Phrase mode state
  const [phrase, setPhrase] = useState("");

  // Privkey mode state
  const [evmKey, setEvmKey] = useState("");
  const [derivedAddress, setDerivedAddress] = useState<string | null>(null);

  const [step, setStep] = useState<Step>("input");
  const [walletName, setWalletName] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const phraseValid = isValidMnemonic(normalizeMnemonic(phrase));

  const privKeyNormalized = evmKey.trim().startsWith("0x") ? evmKey.trim() : `0x${evmKey.trim()}`;
  const privKeyValid = /^0x[0-9a-fA-F]{64}$/.test(privKeyNormalized);

  const canContinue = mode === "phrase" ? phraseValid : privKeyValid;

  // Derive EVM address preview when private key changes
  useEffect(() => {
    if (!privKeyValid) { setDerivedAddress(null); return; }
    try {
      const keyBytes = new Uint8Array(Buffer.from(privKeyNormalized.slice(2), "hex"));
      setDerivedAddress(evmAddressFromPrivateKey(keyBytes));
    } catch { setDerivedAddress(null); }
  }, [privKeyNormalized, privKeyValid]);

  const handlePin = async (pin: string) => {
    try {
      const name = walletName.trim() || (mode === "phrase" ? "Imported Wallet" : "Private Key Wallet");
      if (mode === "phrase") {
        await importMnemonic(normalizeMnemonic(phrase), pin, name);
      } else {
        await importPrivKey(privKeyNormalized, pin, name);
      }
      haptic("heavy");
      onDone();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Import failed.");
      setStep("input");
    }
  };

  if (step === "pin") {
    return (
      <div className="screen center">
        <div className="backbar">
          <button className="back" onClick={() => setStep("input")}>‹</button>
          <span>{t("create.pinTitle")}</span>
        </div>
        <p className="lead">{t("create.pinLead")}</p>
        <PinPad onComplete={handlePin} />
        {err && <p className="error-text">{err}</p>}
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="backbar">
        <button className="back" onClick={() => { haptic("light"); onBack(); }}>‹</button>
        <span>{t("import.title")}</span>
      </div>

      {/* Mode switcher */}
      <div className="tab-bar" style={{ marginBottom: 16 }}>
        <button
          className={`tab-btn${mode === "phrase" ? " active" : ""}`}
          onClick={() => { setMode("phrase"); setErr(null); }}
        >
          {t("import.tabPhrase")}
        </button>
        <button
          className={`tab-btn${mode === "privkey" ? " active" : ""}`}
          onClick={() => { setMode("privkey"); setErr(null); }}
        >
          {t("import.tabPrivkey")}
        </button>
      </div>

      {mode === "phrase" ? (
        <>
          <p className="lead">{t("import.lead")}</p>
          <textarea
            className="seed-input" rows={4}
            autoCapitalize="none" autoCorrect="off" spellCheck={false}
            value={phrase}
            onChange={(e) => { setPhrase(e.target.value); setErr(null); }}
            placeholder="word1 word2 word3 …"
          />
          <div className="hint-row">
            {phrase.trim() === "" ? <span className="muted">{t("import.privacy")}</span>
              : phraseValid ? <span className="ok-text">{t("import.valid")}</span>
              : <span className="error-text">{t("import.invalid")}</span>}
          </div>
        </>
      ) : (
        <>
          <p className="lead">{t("import.privkeyLead")}</p>
          <input
            className="seed-input"
            style={{ fontFamily: "monospace", fontSize: 13, padding: "12px" }}
            autoCapitalize="none" autoCorrect="off" spellCheck={false}
            value={evmKey}
            onChange={(e) => { setEvmKey(e.target.value); setErr(null); }}
            placeholder="0x… or 64 hex chars"
          />
          {derivedAddress && (
            <div className="hint-row">
              <span className="ok-text">{t("import.evmAddress")}: {derivedAddress.slice(0, 10)}…{derivedAddress.slice(-8)}</span>
            </div>
          )}
          {evmKey.trim() !== "" && !privKeyValid && (
            <div className="hint-row"><span className="error-text">{t("import.privkeyInvalid")}</span></div>
          )}
          <p className="muted" style={{ fontSize: 12, marginTop: 8 }}>{t("import.privkeyEvmOnly")}</p>
        </>
      )}

      {/* Optional wallet name */}
      <label className="field" style={{ marginTop: 12 }}>
        <span>{t("wallets.name")}</span>
        <input
          value={walletName}
          onChange={(e) => setWalletName(e.target.value)}
          placeholder={mode === "phrase" ? t("wallets.defaultPhrase") : t("wallets.defaultPrivkey")}
        />
      </label>

      {err && <p className="error-text">{err}</p>}

      <button
        className="btn"
        disabled={!canContinue}
        onClick={() => { haptic("medium"); setStep("pin"); }}
      >
        {t("import.continue")}
      </button>
    </div>
  );
}
