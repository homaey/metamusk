import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ALL_TOKENS, searchTokens, NETWORKS } from "@nova/chains";
import { CoinLogo } from "../components/CoinLogo.js";
import { tokenLogo } from "../networkMeta.js";

const networkName = (id: string) => NETWORKS[id]?.name ?? id;

/** Searchable catalog of supported tokens across all chains. */
export function Tokens() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [chain, setChain] = useState<string>("all");

  const chains = useMemo(
    () => [...new Set(ALL_TOKENS.map((tok) => tok.networkId))].filter((id) => !NETWORKS[id]?.isTestnet),
    [],
  );

  const results = useMemo(
    () => searchTokens(query, chain === "all" ? undefined : chain),
    [query, chain],
  );

  return (
    <div className="app">
      <header className="brand">
        <div className="mark" />
        <h1>{t("tokens.title")}</h1>
        <span className="net">{t("tokens.count", { count: ALL_TOKENS.length })}</span>
      </header>

      <input
        className="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("tokens.search")}
      />

      <div className="chips">
        <button className={`chip ${chain === "all" ? "on" : ""}`} onClick={() => setChain("all")}>All</button>
        {chains.map((id) => (
          <button key={id} className={`chip ${chain === id ? "on" : ""}`} onClick={() => setChain(id)}>
            {networkName(id)}
          </button>
        ))}
      </div>

      <div className="card">
        <h2>{t("tokens.popular")}</h2>
        {results.map((tok) => (
          <div key={`${tok.networkId}:${tok.address ?? "native"}`} className="row">
            <CoinLogo src={tokenLogo(tok.networkId, tok.address)} networkId={tok.networkId} symbol={tok.symbol} size={36} />
            <div>
              <div className="name">{tok.name} {tok.native && <em className="tag">native</em>}</div>
              <div className="meta">{tok.symbol} · {networkName(tok.networkId)}</div>
            </div>
            <span className="right mono">{tok.address ? `${tok.address.slice(0, 6)}…` : "—"}</span>
          </div>
        ))}
        {results.length === 0 && <p className="muted center-text" style={{ padding: 16 }}>—</p>}
      </div>
    </div>
  );
}
