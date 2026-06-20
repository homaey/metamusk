import { useState } from "react";
import { NetworkBadge } from "./NetworkBadge.js";

/**
 * Coin/token logo image with a graceful fallback to a colored badge when the
 * asset 404s or fails to load (not every token has a hosted logo).
 */
export function CoinLogo({
  src,
  networkId,
  symbol,
  size = 36,
}: {
  src?: string;
  networkId: string;
  symbol: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <NetworkBadge id={networkId} symbol={symbol} size={size} />;
  return (
    <img
      className="coin-logo"
      src={src}
      width={size}
      height={size}
      alt={symbol}
      loading="lazy"
      onError={() => setFailed(true)}
      style={{ width: size, height: size }}
    />
  );
}
