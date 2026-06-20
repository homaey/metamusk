import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, type TxRecord } from "../api.js";
import { haptic } from "../telegram.js";

const short = (h: string) => h.length > 16 ? `${h.slice(0, 8)}…${h.slice(-6)}` : h;

function fmtDate(iso: string): string {
  if (!iso) return "";
  try { return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(iso)); }
  catch { return ""; }
}

interface Props { networkId: string; address: string; networkName: string; onClose: () => void }

export function History({ networkId, address, networkName, onClose }: Props) {
  const { t } = useTranslation();
  const [txs, setTxs] = useState<TxRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(false);
    api.txHistory(networkId, address)
      .then((r) => { if (!cancelled) { setTxs(r.txs); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [networkId, address]);

  const openExplorer = (hash: string) => {
    const urls: Record<string, string> = {
      "evm:1": `https://etherscan.io/tx/${hash}`,
      "evm:42161": `https://arbiscan.io/tx/${hash}`,
      "evm:10": `https://optimistic.etherscan.io/tx/${hash}`,
      "evm:8453": `https://basescan.org/tx/${hash}`,
      "evm:56": `https://bscscan.com/tx/${hash}`,
      "evm:137": `https://polygonscan.com/tx/${hash}`,
      "evm:43114": `https://snowtrace.io/tx/${hash}`,
      "ton:mainnet": `https://tonviewer.com/transaction/${hash}`,
      "solana:mainnet": `https://solscan.io/tx/${hash}`,
      "bitcoin:mainnet": `https://mempool.space/tx/${hash}`,
    };
    const url = urls[networkId];
    if (url) window.open(url, "_blank", "noopener");
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet history-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <h2 className="sheet-title">{t("history.title")} · {networkName}</h2>

        {loading && (
          <div className="history-list">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="tx-row">
                <span className="skeleton tx-icon-skel" />
                <div className="tx-body">
                  <div className="skeleton" style={{ width: 120, height: 13, borderRadius: 6 }} />
                  <div className="skeleton" style={{ width: 80, height: 11, borderRadius: 6, marginTop: 5 }} />
                </div>
                <div className="skeleton" style={{ width: 70, height: 13, borderRadius: 6 }} />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="history-empty">
            <div className="history-empty-icon">⚠️</div>
            <p className="muted">{t("history.loadFailed")}</p>
          </div>
        )}

        {!loading && !error && txs.length === 0 && (
          <div className="history-empty">
            <div className="history-empty-icon">🕳️</div>
            <p className="muted">{t("history.empty")}</p>
          </div>
        )}

        {!loading && !error && txs.length > 0 && (
          <div className="history-list">
            {txs.map((tx, i) => (
              <button key={tx.hash || i} className="tx-row pressable" onClick={() => { haptic("light"); openExplorer(tx.hash); }}>
                <span className={`tx-icon ${tx.direction}`}>
                  {tx.status === "error" ? "✕" : tx.direction === "in" ? "↓" : tx.direction === "out" ? "↑" : "⇄"}
                </span>
                <div className="tx-body">
                  <div className="tx-hash">{short(tx.hash)}</div>
                  <div className="tx-date">{fmtDate(tx.timestamp)}</div>
                </div>
                <div className="tx-amount-col">
                  <div className={`tx-amount ${tx.direction}`}>
                    {tx.direction === "in" ? "+" : tx.direction === "out" ? "−" : ""}{tx.value} {tx.symbol}
                  </div>
                  {tx.status !== "ok" && (
                    <div className={`tx-status ${tx.status}`}>{t(`history.${tx.status}`)}</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <button className="btn secondary" style={{ marginTop: 12 }} onClick={onClose}>{t("common.done")}</button>
      </div>
    </div>
  );
}
