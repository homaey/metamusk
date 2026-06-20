import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { createMnemonic } from "@nova/wallet-core";
import { useWallet } from "../wallet/store.js";
import { PinPad } from "../components/PinPad.js";
import { haptic } from "../telegram.js";

type Step = "warn" | "reveal" | "confirm" | "pin";

export function CreateWallet({ onDone, onBack }: { onDone: () => void; onBack: () => void }) {
  const { t } = useTranslation();
  const { createFromMnemonic } = useWallet();
  const [step, setStep] = useState<Step>("warn");
  const mnemonic = useMemo(() => createMnemonic(128), []); // 12 words
  const words = useMemo(() => mnemonic.split(" "), [mnemonic]);
  const [revealed, setRevealed] = useState(false);

  const quiz = useMemo(() => {
    const idxs = new Set<number>();
    while (idxs.size < 2) idxs.add(Math.floor(Math.random() * words.length));
    return [...idxs];
  }, [words]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const quizPass = quiz.every((i) => answers[i]?.trim().toLowerCase() === words[i]);

  if (step === "warn") {
    return (
      <div className="screen">
        <BackBar onBack={onBack} title={t("create.warnTitle")} />
        <div className="banner danger">
          <span className="ico">⚠️</span>
          <div><b>{t("create.warnHeading")}</b>{t("create.warnBody")}</div>
        </div>
        <ul className="bullets">
          <li>{t("create.write")}</li>
          <li>{t("create.share")}</li>
          <li>{t("create.chat")}</li>
        </ul>
        <button className="btn" onClick={() => { haptic("medium"); setStep("reveal"); }}>{t("create.understand")}</button>
      </div>
    );
  }

  if (step === "reveal") {
    return (
      <div className="screen">
        <BackBar onBack={() => setStep("warn")} title={t("create.phraseTitle")} />
        <div className={`seed-grid ${revealed ? "" : "blurred"}`}>
          {words.map((w, i) => (
            <div key={i} className="seed-word"><span className="num">{i + 1}</span>{w}</div>
          ))}
          {!revealed && (
            <button className="reveal-overlay" onClick={() => { haptic("light"); setRevealed(true); }}>{t("create.reveal")}</button>
          )}
        </div>
        <button className="btn" disabled={!revealed} onClick={() => { haptic("medium"); setStep("confirm"); }}>{t("create.written")}</button>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="screen">
        <BackBar onBack={() => setStep("reveal")} title={t("create.confirmTitle")} />
        <p className="lead">{t("create.confirmLead")}</p>
        {quiz.map((i) => (
          <label key={i} className="field">
            <span>{t("create.word", { n: i + 1 })}</span>
            <input autoCapitalize="none" autoCorrect="off" value={answers[i] ?? ""}
              onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
              placeholder={t("create.enterWord", { n: i + 1 })} />
          </label>
        ))}
        <button className="btn" disabled={!quizPass} onClick={() => { haptic("medium"); setStep("pin"); }}>{t("create.confirm")}</button>
      </div>
    );
  }

  return (
    <div className="screen center">
      <BackBar onBack={() => setStep("confirm")} title={t("create.pinTitle")} />
      <p className="lead">{t("create.pinLead")}</p>
      <PinPad onComplete={async (pin) => { await createFromMnemonic(mnemonic, pin); haptic("heavy"); onDone(); }} />
    </div>
  );
}

function BackBar({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="backbar">
      <button className="back" onClick={() => { haptic("light"); onBack(); }}>‹</button>
      <span>{title}</span>
    </div>
  );
}
