/**
 * Token price service. Proxies CoinGecko (so the client needs no key / avoids
 * CORS) with a short in-memory cache to stay within free rate limits.
 */
import { PRICE_API } from "../config.js";

type PriceMap = Record<string, number>;
const TTL_MS = 60_000;

const cache = new Map<string, { at: number; usd: number }>();

export async function getPrices(ids: string[]): Promise<PriceMap> {
  const wanted = [...new Set(ids.filter(Boolean))];
  const now = Date.now();
  const fresh: PriceMap = {};
  const stale: string[] = [];

  for (const id of wanted) {
    const hit = cache.get(id);
    if (hit && now - hit.at < TTL_MS) fresh[id] = hit.usd;
    else stale.push(id);
  }

  if (stale.length > 0) {
    const url = `${PRICE_API}/simple/price?ids=${encodeURIComponent(stale.join(","))}&vs_currencies=usd`;
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (res.ok) {
      const data = (await res.json()) as Record<string, { usd?: number }>;
      for (const id of stale) {
        const usd = data[id]?.usd;
        if (typeof usd === "number") {
          cache.set(id, { at: now, usd });
          fresh[id] = usd;
        }
      }
    }
  }
  return fresh;
}
