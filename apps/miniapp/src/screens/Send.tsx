import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { assessTransferRisk, tokensForNetwork, type RiskReport } from "@nova/chains";
import type { ChainAccount } from "../wallet/accounts.js";
import { getRecents, addRecent } from "../wallet/recents.js";
import { signAndSend, type SendResult } from "../wallet/sign.js";
import { CoinLogo } from "../components/CoinLogo.js";
import { nativeLogo, tokenLogo } from "../networkMeta.js";
import { api } from "../api.js";
import { haptic } from "../telegram.js";

interface TokenOption { symbol: string; address: string | null; decimals: number; name: string }

export function Send({
  account, networkId, symbol, networkName, onClose,
}: {
  account: ChainAccount; networkId: string; symbol: string; networkName: string; onClose: () => void;
}) {
  const { t } = useTranslation();

  // Token list: native first, then ERC-20 tokens for this network (EVM only)
  const tokens: TokenOption[] = useMemo(() => {
    const native: TokenOption = { symbol, address: null, decimals: account.family === "ton" ? 9 : account.family === "solana" ? 9 : account.family === "bitcoin" ? 8 : 18, name: symbol };
    if (account.family !== "evm") return [native];
    const extras = tokensForNetwork(networkId)
      .filter((tk) => !tk.native && tk.address)
      .map((tk) => ({ symbol: tk.symbol, address: tk.address!, decimals: tk.decimals, name: tk.name }));
    return [native, ...extras];
  }, [networkId, symbol, account.family]);

  const [selectedIdx, setSelectedIdx] = useState(0);
  const selected = tokens[selectedIdx] ?? tokens[0]!;
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [tokenBalances, setTokenBalances] = useState<Record<string, string>>({});
  const [recents, setRecents] = useState<string[]>([]);
  const [step, setStep] = useState<"form" | "review">("form");
  const [result, setResult] = useState<SendResult | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { void getRecents(account.family).then(setRecents); }, [account.family]);

  // Fetch ERC-20 balances for display (best effort)
  useEffect(() => {
    if (account.family !== "evm") return;
    api.tokenBalances(networkId, account.address)
      .then((r) => {
        const map: Record<string, string> = {};
        r.tokens.forEach((tk) => { if (tk.address) map[tk.address.toLowerCase()] = tk.formatted; });
        setTokenBalances(map);
      })
      .catch(() => { /* non-critical */ });
  }, [networkId, account.address, account.family]);

  const selectedBalance = selected.address
    ? tokenBalances[selected.address.toLowerCase()] ?? null
    : null;

  const risk: RiskReport | null = useMemo(() => {
    if (!to.trim()) return null;
    return assessTransferRisk({ family: account.family, from: account.address, to: to.trim(), knownRecipients: recents });
  }, [to, account, recents]);

  const canReview = Boolean(risk?.canProceed) && amount !== "" && Number(amount) > 0;

  const confirm = async () => {
    setBusy(true); haptic("medium");
    const res = await signAndSend({
      family: account.family, networkId, to: to.trim(), amount,
      tokenAddress: selected.address ?? undefined,
      tokenDecimals: selected.address ? selected.decimals : undefined,
    });
    if (res.status === "sent") { void addRecent(account.family, to.trim()); haptic("heavy"); }
    setResult(res); setBusy(false);
  };

  if (result) {
    const ok = result.status === "sent";
    return (
      <Sheet onClose={onClose}>
        <h2 className="sheet-title">{ok ? t("send.sent") : result.error === "needRpc" ? t("send.notConnected") : t("send.broadcastFail")}</h2>
        <div className={`result-badge ${ok ? "ok" : result.error === "needRpc" ? "warn" : "err"}`}>{ok ? "✓" : "⚠"}</div>
        {result.error === "needRpc" && <p className="muted center-text">{t("send.needRpc")}</p>}
        {result.error && result.error !== "needRpc" && <p className="muted center-text">{result.error}</p>}
        {result.hash && <div className="address-box">{result.hash}</div>}
        <button className="btn" onClick={onClose}>{t("common.done")}</button>
      </Sheet>
    );
  }

  if (step === "review") {
    return (
      <Sheet onClose={() => setStep("form")}>
        <h2 className="sheet-title">{t("send.reviewTitle")}</h2>
        <dl className="review">
          <Row k={t("send.from")} v={`${selected.symbol} · ${shorten(account.address)}`} />
          <Row k={t("send.to")} v={shorten(to)} />
          <Row k={t("send.amount")} v={`${amount} ${selected.symbol}`} />
          <Row k={t("send.network")} v={networkName} />
        </dl>
        {risk && risk.findings.length > 0 && (
          <div className={`risk-box ${risk.level}`}>
            <b>{risk.level === "red" ? t("send.riskRed") : risk.level === "yellow" ? t("send.riskYellow") : t("send.riskGreen")}</b>
            <ul>{risk.findings.map((f) => <li key={f.code}>{f.message}</li>)}</ul>
          </div>
        )}
        <button className="btn" disabled={busy || !risk?.canProceed} onClick={confirm}>{busy ? "…" : t("send.confirm")}</button>
        <button className="btn secondary" onClick={() => setStep("form")}>{t("common.cancel")}</button>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose}>
      <div className="sheet-head">
        <CoinLogo
          src={selected.address ? tokenLogo(networkId, selected.address) : nativeLogo(networkId)}
          networkId={networkId} symbol={selected.symbol} size={28}
        />
        <h2 className="sheet-title">{t("send.title")} · {networkName}</h2>
      </div>

      {/* Token selector — EVM only, shows when >1 token available */}
      {tokens.length > 1 && (
        <label className="field">
          <span>{t("send.asset")}</span>
          <select value={selectedIdx} onChange={(e) => { setSelectedIdx(Number(e.target.value)); setAmount(""); }}>
            {tokens.map((tk, i) => (
              <option key={tk.address ?? "native"} value={i}>
                {tk.symbol} — {tk.name}
                {i === 0 ? "" : tokenBalances[tk.address!.toLowerCase()] ? ` (${tokenBalances[tk.address!.toLowerCase()]} available)` : ""}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className="field">
        <span>{t("send.recipient")}</span>
        <input value={to} autoCapitalize="none" autoCorrect="off" spellCheck={false}
          onChange={(e) => setTo(e.target.value)} placeholder={t("send.recipientPlaceholder")} />
      </label>

      {risk && (
        <div className={`risk-pill ${risk.level}`}>
          {risk.level === "green" ? "🟢" : risk.level === "yellow" ? "🟡" : "🔴"}{" "}
          {risk.findings[0]?.message ?? t("send.riskGreen")}
        </div>
      )}

      <label className="field">
        <span>
          {t("send.amount")} ({selected.symbol})
          {selectedBalance != null && <span className="field-hint"> · {selectedBalance} {t("send.available")}</span>}
        </span>
        <input inputMode="decimal" value={amount}
          onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} placeholder="0.0" />
      </label>

      <button className="btn" disabled={!canReview} onClick={() => { haptic("light"); setStep("review"); }}>{t("send.review")}</button>
      <button className="btn secondary" onClick={onClose}>{t("common.cancel")}</button>
    </Sheet>
  );
}

const shorten = (a: string) => (a.length > 18 ? `${a.slice(0, 10)}…${a.slice(-8)}` : a);
function Row({ k, v }: { k: string; v: string }) { return <div className="review-row"><dt>{k}</dt><dd className="mono">{v}</dd></div>; }
function Sheet({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        {children}
      </div>
    </div>
  );
}
