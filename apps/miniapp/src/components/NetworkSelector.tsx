import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNetwork } from "../context/network.js";
import { CoinLogo } from "./CoinLogo.js";
import { nativeLogo } from "../networkMeta.js";
import { haptic } from "../telegram.js";

/** Network dropdown: a pill that opens a bottom sheet listing every network. */
export function NetworkSelector() {
  const { t } = useTranslation();
  const { networks, active, setActive } = useNetwork();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="net-pill" onClick={() => { haptic("light"); setOpen(true); }}>
        <CoinLogo src={nativeLogo(active.id)} networkId={active.id} symbol={active.nativeSymbol} size={22} />
        <span className="net-pill-name">{active.name}</span>
        <span className="net-pill-caret">▾</span>
      </button>

      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-handle" />
            <h2 className="sheet-title">{t("network.select")}</h2>
            <div className="net-list">
              {networks.map((n) => (
                <button
                  key={n.id}
                  className={`net-item ${n.id === active.id ? "active" : ""}`}
                  onClick={() => { haptic("light"); setActive(n.id); setOpen(false); }}
                >
                  <CoinLogo src={nativeLogo(n.id)} networkId={n.id} symbol={n.nativeSymbol} size={34} />
                  <div className="net-item-text">
                    <div className="net-item-name">{n.name}</div>
                    <div className="net-item-sym">{n.nativeSymbol}</div>
                  </div>
                  {n.id === active.id && <span className="net-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
