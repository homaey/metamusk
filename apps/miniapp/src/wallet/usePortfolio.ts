/**
 * Live portfolio: fetches USD prices + native + token balances, then computes
 * per-account fiat and total net worth. Read-only — addresses only.
 */
import { useEffect, useState } from "react";
import { api } from "../api.js";
import type { ChainAccount } from "./accounts.js";

/** Primary network + CoinGecko id used to value each account's native asset. */
const FAMILY_MAP: Record<ChainAccount["family"], { net: string; cg: string }> = {
  ton: { net: "ton:mainnet", cg: "the-open-network" },
  evm: { net: "evm:1", cg: "ethereum" },
  solana: { net: "solana:mainnet", cg: "solana" },
  bitcoin: { net: "bitcoin:mainnet", cg: "bitcoin" },
};

export interface AccountBalance {
  account: ChainAccount;
  formatted: string;
  symbol: string;
  fiat: number | null;
  error: boolean;
}

export interface Portfolio {
  items: AccountBalance[];
  totalFiat: number | null;
  loading: boolean;
}

export function usePortfolio(accounts: ChainAccount[]): Portfolio {
  const [items, setItems] = useState<AccountBalance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (accounts.length === 0) return;
    let cancelled = false;
    setLoading(true);

    (async () => {
      // Round 1: native balances + EVM token balances in parallel
      const [nativeResults, tokenResults] = await Promise.all([
        Promise.all(
          accounts.map(async (a) => {
            try { return await api.balance(FAMILY_MAP[a.family].net, a.address); }
            catch { return null; }
          }),
        ),
        Promise.all(
          accounts.map(async (a) => {
            if (a.family !== "evm") return { tokens: [] as import("../api.js").TokenBalance[] };
            try { return await api.tokenBalances(FAMILY_MAP[a.family].net, a.address); }
            catch { return { tokens: [] as import("../api.js").TokenBalance[] }; }
          }),
        ),
      ]);

      // Round 2: single price call for all asset ids
      const nativeCgIds = accounts.map((a) => FAMILY_MAP[a.family].cg);
      const tokenCgIds = tokenResults
        .flatMap((r) => r.tokens.map((t) => t.coingeckoId).filter(Boolean)) as string[];
      const allIds = [...new Set([...nativeCgIds, ...tokenCgIds])];
      const priceRes = await api.prices(allIds).catch(() => ({ prices: {} as Record<string, number> }));
      const prices = priceRes.prices;

      // Compute per-account totals (native + tokens)
      const results = accounts.map((account, i): AccountBalance => {
        const bal = nativeResults[i];
        if (!bal) return { account, formatted: "—", symbol: account.symbol, fiat: null, error: true };

        const nativeCg = FAMILY_MAP[account.family].cg;
        const nativePrice = prices[nativeCg];
        const nativeFiat = typeof nativePrice === "number" ? Number(bal.formatted) * nativePrice : 0;

        const tokens = tokenResults[i]?.tokens ?? [];
        const tokenFiat = tokens.reduce((sum, tk) => {
          const p = tk.coingeckoId ? prices[tk.coingeckoId] : undefined;
          return sum + (typeof p === "number" ? Number(tk.formatted) * p : 0);
        }, 0);

        return {
          account,
          formatted: bal.formatted,
          symbol: bal.symbol,
          fiat: nativeFiat + tokenFiat,
          error: false,
        };
      });

      if (!cancelled) { setItems(results); setLoading(false); }
    })();

    return () => { cancelled = true; };
  }, [accounts]);

  const withFiat = items.filter((i) => i.fiat !== null);
  const totalFiat = withFiat.length > 0 ? withFiat.reduce((s, i) => s + (i.fiat ?? 0), 0) : null;

  return { items, totalFiat, loading };
}

/** Live native balance for one specific network + address (e.g. the active network). */
export function useNetworkBalance(networkId: string, address: string, cgId: string) {
  const [state, setState] = useState<{ formatted: string; symbol: string; fiat: number | null; loading: boolean; error: boolean }>(
    { formatted: "0", symbol: "", fiat: null, loading: true, error: false },
  );

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: false }));
    (async () => {
      try {
        const [b, p] = await Promise.all([api.balance(networkId, address), api.prices([cgId])]);
        const price = p.prices[cgId];
        if (!cancelled) {
          setState({
            formatted: b.formatted,
            symbol: b.symbol,
            fiat: typeof price === "number" ? Number(b.formatted) * price : null,
            loading: false,
            error: false,
          });
        }
      } catch {
        if (!cancelled) setState((s) => ({ ...s, loading: false, error: true }));
      }
    })();
    return () => { cancelled = true; };
  }, [networkId, address, cgId]);

  return state;
}

export interface Asset {
  symbol: string;
  name: string;
  /** null for the native coin. */
  address: string | null;
  formatted: string;
  fiat: number | null;
}

/**
 * Full asset list for one network: native coin + non-zero token balances, each
 * valued in USD. Powers the MetaMask-style assets list on Home.
 */
export function useAssets(networkId: string, address: string, nativeCg: string) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) return;
    let cancelled = false;
    setLoading(true);
    (async () => {
      const [nativeBal, tokenRes] = await Promise.all([
        api.balance(networkId, address).catch(() => null),
        api.tokenBalances(networkId, address).catch(() => ({ tokens: [] })),
      ]);
      const tokens = tokenRes.tokens;
      const ids = [nativeCg, ...tokens.map((tk) => tk.coingeckoId).filter(Boolean) as string[]];
      const priceRes = await api.prices([...new Set(ids)]).catch(() => ({ prices: {} as Record<string, number> }));
      const prices = priceRes.prices;
      const valued = (cg: string | undefined, formatted: string): number | null =>
        cg && typeof prices[cg] === "number" ? Number(formatted) * prices[cg]! : null;

      const list: Asset[] = [];
      if (nativeBal) list.push({ symbol: nativeBal.symbol, name: nativeBal.symbol, address: null, formatted: nativeBal.formatted, fiat: valued(nativeCg, nativeBal.formatted) });
      for (const tk of tokens) list.push({ symbol: tk.symbol, name: tk.name, address: tk.address, formatted: tk.formatted, fiat: valued(tk.coingeckoId, tk.formatted) });

      if (!cancelled) { setAssets(list); setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, [networkId, address, nativeCg]);

  return { assets, loading };
}

/** Trim a decimal string to a readable length without rounding up the integer part. */
export function trimAmount(formatted: string, maxFrac = 6): string {
  if (!formatted.includes(".")) return formatted;
  const [whole, frac] = formatted.split(".");
  const trimmed = frac!.slice(0, maxFrac).replace(/0+$/, "");
  return trimmed ? `${whole}.${trimmed}` : whole!;
}

export function formatUsd(value: number | null): string {
  if (value === null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
