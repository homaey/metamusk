/**
 * Active-network context. Lets the user pick a network from a dropdown (MetaMask
 * pattern); the rest of the app reads `active` to decide which chain to show,
 * which account address applies, and which balance to fetch.
 */
import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { NETWORKS } from "@nova/chains";
import type { NetworkInfo } from "../api.js";

interface NetworkContextValue {
  networks: NetworkInfo[];
  active: NetworkInfo;
  setActive: (id: string) => void;
}

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const networks = useMemo(
    () => Object.values(NETWORKS).filter((n) => !n.isTestnet) as NetworkInfo[],
    [],
  );
  const [activeId, setActiveId] = useState<string>("evm:1");
  const active = (NETWORKS[activeId] ?? networks[0]) as NetworkInfo;

  return (
    <NetworkContext.Provider value={{ networks, active, setActive: setActiveId }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork(): NetworkContextValue {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
}
