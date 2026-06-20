import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NETWORKS, tokensForNetwork } from "@nova/chains";
import type { ChainAccount } from "../wallet/accounts.js";
import { api, type SwapQuote } from "../api.js";
import { executeSwap, type SendResult } from "../wallet/sign.js";
import { CoinLogo } from "../components/CoinLogo.js";
import { nativeLogo, tokenLogo } from "../networkMeta.js";
import { formatUsd } from "../wallet/usePortfolio.js";
import { haptic } from "../telegram.js";

interface TokenOpt { ref: string; symbol: string; address: string | null }

export function Swap({
  networkId, networkName, account, onClose,
}: {
  networkId: string; networkName: string; account: ChainAccount; onClose: () => void;
}) {
  const { t } = useTranslation();
  const net = NETWORKS[networkId]!;
  const isEvm = net.family === "evm";

  const options: TokenOpt[] = useMemo(() => {
    const native: TokenOpt = { ref: "native", symbol: net.nativeSymbol, address: null };
    const toks = tokensForNetwork(networkId)
      .filter((tk) => !tk.native && tk.address)
      .map((tk) => ({ ref: tk.address!, symbol: tk.symbol, address: tk.address! }));
    return [native, ...toks];
  }, [networkId, net.nativeSymbol]);

  const [from, setFrom] = useState<TokenOpt>(options[0]!);
  const [to, setTo] = useState<TokenOpt>(options[1] ?? options[0]!);
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [result, setResult] = useState<SendResult | null>(null);
  const [busy, setBusy] = useState(false);

  // Debounced quote fetch.
  useEffect(() => {
    setQuote(null); setErrMsg(null);
    if (!isEvm || from.ref === to.ref || amount === "" || Number(amount) <= 0) { setStatus("idle"); return; }
    setStatus("loading");
    const id = setTimeout(async () => {
      try {
        const q = await api.swapQuote({ network: networkId, from: from.ref, to: to.ref, amount, address: account.address });
        setQuote(q); setStatus("idle");
      } catch (e) { setStatus("error"); setErrMsg(e instanceof Error ? e.message : "No route"); }
    }, 500);
    return () => clearTimeout(id);
  }, [isEvm, from.ref, to.ref, amount, networkId, account.address]);

  const impact = quote?.priceImpact ?? null;
  // Too-good-to-be-true (output worth >2% more than input) signals a mispriced
  // route — treat as unsafe, not as a bargain.
  const suspicious = impact != null && impact < -0.02;
  const impactLevel = impact == null ? "green" : suspicious || impact > 0.05 ? "red" : impact > 0.01 ? "yellow" : "green";

  const confirm = async () => {
    if (!quote?.tx) return;
    setBusy(true); haptic("medium");
    const res = await executeSwap(networkId, quote.tx);
    if (res.status === "sent") haptic("heavy");
    setResult(res); setBusy(false);
  };

  const swapSides = () => { setFrom(to); setTo(from); setAmount(""); };

  if (result) {
    const ok = result.status === "sent";
    return (
      <Sheet onClose={onClose}>
        <h2 className="sheet-title">{ok ? t("swap.sent") : t("swap.failed")}</h2>
        <div className={`result-badge ${ok ? "ok" : "err"}`}>{ok ? "✓" : "⚠"}</div>
        {!ok && result.error && <p className="muted center-text">{result.error}</p>}
        {result.hash && <div className="address-box">{result.hash}</div>}
        <button className="btn" onClick={onClose}>{t("common.done")}</button>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose}>
      <h2 className="sheet-title">{t("swap.title")} · {networkName}</h2>

      {!isEvm ? (
        <p className="muted center-text" style={{ padding: "20px 0" }}>{t("swap.notSupported")}</p>
      ) : (
        <>
          <div className="swap-box">
            <div className="swap-label">{t("swap.youPay")}</div>
            <div className="swap-row">
              <input className="swap-amount" inputMode="decimal" value={amount} placeholder="0.0"
                onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} />
              <TokenSelect networkId={networkId} options={options} value={from} onChange={setFrom} />
            </div>
          </div>

          <button className="swap-flip" onClick={() => { haptic("light"); swapSides(); }} aria-label="flip">⇅</button>

          <div className="swap-box">
            <div className="swap-label">{t("swap.youReceive")}</div>
            <div className="swap-row">
              <div className="swap-amount out">
                {status === "loading" ? <span className="skeleton" style={{ width: 90, height: 22, display: "inline-block" }} />
                  : quote ? `≈ ${trim(quote.toAmountFormatted)}` : "0.0"}
              </div>
              <TokenSelect networkId={networkId} options={options} value={to} onChange={setTo} />
            </div>
            {quote?.toAmountUsd != null && <div className="swap-usd">{formatUsd(quote.toAmountUsd)}</div>}
          </div>

          {errMsg && <div className="risk-pill red">🔴 {errMsg}</div>}

          {quote && (
            <dl className="review">
              <Row k={t("swap.route")} v={quote.route} />
              <Row k={t("swap.priceImpact")} v={quote.priceImpact != null ? `${(quote.priceImpact * 100).toFixed(2)}%` : "—"} cls={impactLevel} />
              <Row k={t("swap.minReceived")} v={`${trim(quote.toAmountMinFormatted)} ${quote.toToken.symbol}`} />
              <Row k={t("swap.networkFee")} v={quote.gasUsd != null ? formatUsd(quote.gasUsd) : "—"} />
            </dl>
          )}

          <button className="btn" disabled={!quote?.tx || busy} onClick={confirm}>
            {busy ? "…" : t("swap.confirm")}
          </button>
        </>
      )}
      <button className="btn secondary" onClick={onClose}>{t("common.cancel")}</button>
    </Sheet>
  );
}

const trim = (s: string) => { const n = Number(s); return n >= 1 ? n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "") : n.toPrecision(4); };

function TokenSelect({ networkId, options, value, onChange }: { networkId: string; options: TokenOpt[]; value: TokenOpt; onChange: (o: TokenOpt) => void }) {
  return (
    <label className="token-select">
      <CoinLogo src={value.address ? tokenLogo(networkId, value.address) : nativeLogo(networkId)} networkId={networkId} symbol={value.symbol} size={24} />
      <select value={value.ref} onChange={(e) => onChange(options.find((o) => o.ref === e.target.value) ?? value)}>
        {options.map((o) => <option key={o.ref} value={o.ref}>{o.symbol}</option>)}
      </select>
    </label>
  );
}

function Row({ k, v, cls }: { k: string; v: string; cls?: string }) {
  return <div className="review-row"><dt>{k}</dt><dd className={cls ? `risk-text ${cls}` : "mono"}>{v}</dd></div>;
}

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
