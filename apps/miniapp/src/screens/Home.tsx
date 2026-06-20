import { lazy, Suspense, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWallet } from "../wallet/store.js";
import { useNetwork } from "../context/network.js";
import { usePortfolio, useAssets, formatUsd, trimAmount } from "../wallet/usePortfolio.js";
import { NATIVE_CG, nativeLogo, tokenLogo } from "../networkMeta.js";
import { NetworkSelector } from "../components/NetworkSelector.js";
import { CoinLogo } from "../components/CoinLogo.js";
import { LanguageSwitcher } from "../components/LanguageSwitcher.js";
import { Receive } from "./Receive.js";
import { Send } from "./Send.js";
import { haptic } from "../telegram.js";

// Loaded on demand to keep the Home bundle small.
const Swap = lazy(() => import("./Swap.js").then((m) => ({ default: m.Swap })));
const History = lazy(() => import("./History.js").then((m) => ({ default: m.History })));
const Settings = lazy(() => import("./Settings.js").then((m) => ({ default: m.Settings })));
const Tokens = lazy(() => import("./Tokens.js").then((m) => ({ default: m.Tokens })));
const Nfts = lazy(() => import("./Nfts.js").then((m) => ({ default: m.Nfts })));
const DApps = lazy(() => import("./DApps.js").then((m) => ({ default: m.DApps })));

function SheetLoader() {
  return (
    <div className="sheet-backdrop">
      <div className="sheet"><div className="sheet-handle" />
        <div className="skeleton" style={{ width: 160, height: 14, margin: "20px auto" }} />
      </div>
    </div>
  );
}

const short = (a: string) => (a.length > 18 ? `${a.slice(0, 9)}…${a.slice(-7)}` : a);
type Tab = "wallet" | "tokens" | "nfts" | "dapps";

export function Home() {
  const { t } = useTranslation();
  const { accounts, lock, wallets, activeWalletId } = useWallet();
  const { active } = useNetwork();
  const { totalFiat, loading: totalLoading } = usePortfolio(accounts);
  const [receive, setReceive] = useState(false);
  const [send, setSend] = useState(false);
  const [swap, setSwap] = useState(false);
  const [history, setHistory] = useState(false);
  const [settings, setSettings] = useState(false);
  const [tab, setTab] = useState<Tab>("wallet");
  const [copied, setCopied] = useState(false);

  const account = accounts.find((a) => a.family === active.family) ?? accounts[0];
  const { assets, loading: assetsLoading } = useAssets(active.id, account?.address ?? "", NATIVE_CG[active.id] ?? "ethereum");

  const activeWalletName = wallets.find((w) => w.id === activeWalletId)?.name ?? "MetaMusk";

  const copy = async () => {
    if (!account) return;
    try { await navigator.clipboard.writeText(account.address); haptic("medium"); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { /* unavailable */ }
  };

  if (tab === "tokens") {
    return (
      <>
        <Suspense fallback={<SheetLoader />}><Tokens /></Suspense>
        <BottomNav tab={tab} setTab={setTab} t={t} />
      </>
    );
  }

  if (tab === "nfts") {
    return (
      <>
        <Suspense fallback={<SheetLoader />}><Nfts /></Suspense>
        <BottomNav tab={tab} setTab={setTab} t={t} />
      </>
    );
  }

  if (tab === "dapps") {
    return (
      <>
        <Suspense fallback={<SheetLoader />}><DApps /></Suspense>
        <BottomNav tab={tab} setTab={setTab} t={t} />
      </>
    );
  }

  return (
    <>
      <div className="app">
        <header className="brand">
          <img src="/logo.svg" className="mark" alt="" />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <h1 style={{ margin: 0 }}>MetaMusk</h1>
            {wallets.length > 1 && <span className="wallet-label">{activeWalletName}</span>}
          </div>
          <div className="header-actions">
            <LanguageSwitcher compact />
            <button className="icon-btn" onClick={() => { haptic("light"); setSettings(true); }} aria-label={t("settings.title")}>⚙️</button>
            <button className="icon-btn" onClick={() => { haptic("light"); lock(); }} aria-label={t("home.lock")}>🔒</button>
          </div>
        </header>

        <div className="net-row"><NetworkSelector /></div>

        <section className="balance-card">
          <div className="label">{t("home.total")}</div>
          {totalLoading ? <div className="amount"><span className="skeleton balance-skel" /></div>
            : <div className="amount">{formatUsd(totalFiat)}</div>}
          <div className="sub">{accounts.length} chains · {active.name}</div>
        </section>

        <div className="actions">
          <button className="action" onClick={() => { haptic("light"); setSend(true); }}><span className="ico">↑</span>{t("home.send")}</button>
          <button className="action" onClick={() => { haptic("light"); setReceive(true); }}><span className="ico">↓</span>{t("home.receive")}</button>
          <button className="action" onClick={() => { haptic("light"); setSwap(true); }}><span className="ico">⇄</span>{t("home.swap")}</button>
          <button className="action" onClick={() => { haptic("light"); setHistory(true); }}><span className="ico">⧉</span>{t("home.history")}</button>
        </div>

        <div className="card asset-card">
          <div className="asset-card-head">
            <h2>{t("home.assetsOn", { network: active.name })}</h2>
            <button className="asset-addr" onClick={copy}>{copied ? t("receive.copied") : short(account?.address ?? "")}</button>
          </div>

          {assetsLoading ? (
            [0, 1].map((i) => <div key={i} className="asset-row"><span className="skeleton" style={{ width: 38, height: 38, borderRadius: "50%" }} /><div className="skeleton" style={{ width: 120, height: 14 }} /></div>)
          ) : (
            assets.map((a) => (
              <div key={a.address ?? "native"} className="asset-row">
                <CoinLogo src={a.address ? tokenLogo(active.id, a.address) : nativeLogo(active.id)} networkId={active.id} symbol={a.symbol} size={38} />
                <div className="asset-info">
                  <div className="asset-name">{a.symbol}</div>
                  <div className="asset-sub">{a.name}</div>
                </div>
                <div className="asset-bal">
                  <div className="bal-amount">{trimAmount(a.formatted)}</div>
                  <div className="bal-fiat">{formatUsd(a.fiat)}</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="banner">
          <span className="ico">🛡️</span>
          <div><b>{t("home.selfCustody")}</b>{t("home.selfCustodyBody")}</div>
        </div>
      </div>

      <BottomNav tab={tab} setTab={setTab} t={t} />
      {receive && account && <Receive account={account} networkName={active.name} symbol={active.nativeSymbol} networkId={active.id} onClose={() => setReceive(false)} />}
      {send && account && <Send account={account} networkId={active.id} symbol={active.nativeSymbol} networkName={active.name} onClose={() => setSend(false)} />}
      {swap && account && <Suspense fallback={<SheetLoader />}><Swap account={account} networkId={active.id} networkName={active.name} onClose={() => setSwap(false)} /></Suspense>}
      {history && account && <Suspense fallback={<SheetLoader />}><History networkId={active.id} address={account.address} networkName={active.name} onClose={() => setHistory(false)} /></Suspense>}
      {settings && <Suspense fallback={<SheetLoader />}><Settings onClose={() => setSettings(false)} /></Suspense>}
    </>
  );
}

function BottomNav({ tab, setTab, t }: { tab: Tab; setTab: (t: Tab) => void; t: (k: string) => string }) {
  return (
    <nav className="bottom-nav">
      <button className={tab === "wallet" ? "on" : ""} onClick={() => { haptic("light"); setTab("wallet"); }}><span>👛</span>{t("home.accounts")}</button>
      <button className={tab === "tokens" ? "on" : ""} onClick={() => { haptic("light"); setTab("tokens"); }}><span>🪙</span>{t("home.tokens")}</button>
      <button className={tab === "nfts" ? "on" : ""} onClick={() => { haptic("light"); setTab("nfts"); }}><span>🖼️</span>{t("home.nfts")}</button>
      <button className={tab === "dapps" ? "on" : ""} onClick={() => { haptic("light"); setTab("dapps"); }}><span>🔗</span>{t("home.dapps")}</button>
    </nav>
  );
}
