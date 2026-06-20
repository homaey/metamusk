import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "qrcode";
import type { ChainAccount } from "../wallet/accounts.js";
import { CoinLogo } from "../components/CoinLogo.js";
import { nativeLogo } from "../networkMeta.js";
import { haptic } from "../telegram.js";

export function Receive({
  account, networkName, symbol, networkId, onClose,
}: {
  account: ChainAccount; networkName: string; symbol: string; networkId: string; onClose: () => void;
}) {
  const { t } = useTranslation();
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(account.address, { margin: 1, width: 220 }).then(setQr).catch(() => setQr(""));
  }, [account.address]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(account.address); haptic("medium"); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* unavailable */ }
  };

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div className="sheet-head">
          <CoinLogo src={nativeLogo(networkId)} networkId={networkId} symbol={symbol} size={28} />
          <h2 className="sheet-title">{t("receive.title", { symbol })}</h2>
        </div>
        <p className="muted center-text">{networkName}</p>
        <div className="qr-box">{qr ? <img src={qr} alt="address QR" /> : <div className="skeleton qr-skel" />}</div>
        <div className="address-box">{account.address}</div>
        <button className="btn" onClick={copy}>{copied ? t("receive.copied") : t("receive.copy")}</button>
        <div className="banner warn small">
          <span className="ico">ℹ️</span>
          <div>{t("receive.warn", { symbol, label: networkName })}</div>
        </div>
        <button className="btn secondary" onClick={onClose}>{t("receive.close")}</button>
      </div>
    </div>
  );
}
