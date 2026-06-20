import { networkColor } from "../networkMeta.js";

/** Colored round badge with the network's native symbol. */
export function NetworkBadge({ id, symbol, size = 36 }: { id: string; symbol: string; size?: number }) {
  const color = networkColor(id);
  return (
    <span
      className="net-badge"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}cc)`,
        fontSize: Math.max(9, Math.round(size * 0.3)),
      }}
    >
      {symbol.slice(0, 4)}
    </span>
  );
}
