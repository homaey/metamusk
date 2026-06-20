/**
 * Wallet state container — multi-wallet edition.
 *
 * Supports multiple named wallets (mnemonic or EVM privkey) stored as
 * separate AES-256-GCM encrypted envelopes in IndexedDB. The active wallet's
 * key material lives in RAM only (session.ts), never in React state or disk.
 *
 * Storage key "nova-wallets": { activeId, wallets: WalletEntry[] }
 * Legacy "vault" key: migrated to nova-wallets on first boot.
 */
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  sealVault,
  openVault,
  isValidMnemonic,
  normalizeMnemonic,
  type VaultEnvelope,
} from "@nova/wallet-core";
import { kvGet, kvSet, kvDel } from "./db.js";
import { deriveAccounts, deriveAccountsFromPrivKey, type ChainAccount } from "./accounts.js";
import {
  setSessionMnemonic,
  setSessionPrivKey,
  getSessionMnemonic,
  clearSession,
  getSessionType,
} from "./session.js";

const WALLETS_KEY = "metamusk-wallets";
const LEGACY_VAULT_KEY = "vault";
const AUTO_LOCK_MS = 5 * 60 * 1000;

// Privkey vault payload marker (prefix that cannot appear in a BIP39 mnemonic)
const PK_MARKER = '{"t":"pk"';

export interface WalletMeta {
  id: string;
  name: string;
  type: "mnemonic" | "privkey";
  createdAt: number;
}

interface WalletEntry extends WalletMeta {
  envelope: VaultEnvelope;
}

interface WalletStore {
  activeId: string;
  wallets: WalletEntry[];
}

export type WalletStatus = "loading" | "no-wallet" | "locked" | "unlocked";

export interface WalletContextValue {
  status: WalletStatus;
  accounts: ChainAccount[];
  error: string | null;
  /** All wallets (names + metadata, no keys). */
  wallets: WalletMeta[];
  activeWalletId: string | null;
  activeWalletType: "mnemonic" | "privkey" | null;

  /** Create the first (or any new) mnemonic wallet. */
  createFromMnemonic: (mnemonic: string, pin: string, name?: string) => Promise<void>;
  /** Import a BIP39 phrase as a new named wallet. */
  importMnemonic: (mnemonic: string, pin: string, name?: string) => Promise<void>;
  /** Import a raw EVM private key (hex) as a new named wallet. */
  importPrivKey: (evmKey: string, pin: string, name?: string) => Promise<void>;
  /** Unlock the active wallet with its PIN. Returns false on wrong PIN. */
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  /** Switch to a different wallet (requires its PIN). */
  switchWallet: (id: string, pin: string) => Promise<boolean>;
  /** Remove a wallet by id. Cannot remove the last wallet or the active one. */
  removeWallet: (id: string) => Promise<void>;
  /** Rename a wallet. */
  renameWallet: (id: string, newName: string) => Promise<void>;
  /** Destroy ALL wallets on this device (does not affect on-chain funds). */
  reset: () => Promise<void>;
  clearError: () => void;
  /** Serialize the full wallet store to JSON (for cloud backup). */
  dumpStore: () => Promise<string | null>;
  /** Import a decrypted WalletStore JSON (after cloud backup restore). */
  restoreFromBackup: (storeJson: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

// ── Helpers ──────────────────────────────────────────────────────────────────

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function sealPrivKey(evmKey: string, pin: string): VaultEnvelope {
  const normalized = evmKey.startsWith("0x") ? evmKey : `0x${evmKey}`;
  return sealVault(JSON.stringify({ t: "pk", k: normalized }), pin);
}

function openEntry(entry: WalletEntry, pin: string): { type: "mnemonic" | "privkey"; value: string } {
  const raw = openVault(entry.envelope, pin);
  if (raw.startsWith(PK_MARKER)) {
    const { k } = JSON.parse(raw) as { t: string; k: string };
    return { type: "privkey", value: k };
  }
  return { type: "mnemonic", value: raw };
}

async function loadStore(): Promise<WalletStore | null> {
  return (await kvGet<WalletStore>(WALLETS_KEY)) ?? null;
}

async function saveStore(store: WalletStore): Promise<void> {
  await kvSet(WALLETS_KEY, store);
}

// ── Provider ─────────────────────────────────────────────────────────────────

export function WalletProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<WalletStatus>("loading");
  const [accounts, setAccounts] = useState<ChainAccount[]>([]);
  const [wallets, setWallets] = useState<WalletMeta[]>([]);
  const [activeWalletId, setActiveWalletId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lockTimer = useRef<number | undefined>(undefined);

  // Boot: migrate legacy vault or load multi-wallet store.
  useEffect(() => {
    (async () => {
      try {
        let store = await loadStore();

        if (!store) {
          // Check for legacy single vault and migrate it.
          const legacy = await kvGet<VaultEnvelope>(LEGACY_VAULT_KEY);
          if (legacy) {
            store = {
              activeId: "main",
              wallets: [{
                id: "main", name: "Main Wallet", type: "mnemonic",
                createdAt: Date.now(), envelope: legacy,
              }],
            };
            await saveStore(store);
            await kvDel(LEGACY_VAULT_KEY);
          }
        }

        if (store && store.wallets.length > 0) {
          setWallets(store.wallets.map(({ id, name, type, createdAt }) => ({ id, name, type, createdAt })));
          setActiveWalletId(store.activeId);
          setStatus("locked");
        } else {
          setStatus("no-wallet");
        }
      } catch {
        setStatus("no-wallet");
      }
    })();
  }, []);

  function activateSession(entry: WalletEntry, payload: { type: "mnemonic" | "privkey"; value: string }) {
    if (payload.type === "mnemonic") {
      setSessionMnemonic(payload.value);
      setAccounts(deriveAccounts(payload.value));
    } else {
      setSessionPrivKey(payload.value);
      setAccounts(deriveAccountsFromPrivKey(payload.value));
    }
    setActiveWalletId(entry.id);
    setStatus("unlocked");
    setError(null);
  }

  const lock = useMemo(
    () => () => {
      clearSession();
      setAccounts([]);
      setStatus((s) => (s === "unlocked" ? "locked" : s));
    },
    [],
  );

  // Auto-lock on inactivity while unlocked.
  useEffect(() => {
    if (status !== "unlocked") return;
    const reset = () => {
      window.clearTimeout(lockTimer.current);
      lockTimer.current = window.setTimeout(lock, AUTO_LOCK_MS);
    };
    reset();
    const events = ["pointerdown", "keydown", "visibilitychange"];
    events.forEach((e) => window.addEventListener(e, reset));
    return () => {
      window.clearTimeout(lockTimer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
  }, [status, lock]);

  // ── Shared add-wallet helper ─────────────────────────────────────────────

  async function addWallet(
    entry: Omit<WalletEntry, "id" | "createdAt">,
    pin: string,
    makeActive: boolean,
  ): Promise<WalletEntry> {
    const id = uid();
    const full: WalletEntry = { ...entry, id, createdAt: Date.now() };
    const store = (await loadStore()) ?? { activeId: id, wallets: [] };
    store.wallets.push(full);
    if (makeActive) store.activeId = id;
    await saveStore(store);
    setWallets(store.wallets.map(({ id: i, name, type, createdAt }) => ({ id: i, name, type, createdAt })));
    if (makeActive) {
      activateSession(full, openEntry(full, pin));
    }
    return full;
  }

  // ── Context value ────────────────────────────────────────────────────────

  const value: WalletContextValue = {
    status,
    accounts,
    error,
    wallets,
    activeWalletId,
    activeWalletType: getSessionType(),
    clearError: () => setError(null),

    createFromMnemonic: async (mnemonic, pin, name = "Main Wallet") => {
      const envelope = sealVault(mnemonic, pin);
      await addWallet({ name, type: "mnemonic", envelope }, pin, true);
    },

    importMnemonic: async (mnemonic, pin, name = "Imported Wallet") => {
      const normalized = normalizeMnemonic(mnemonic);
      if (!isValidMnemonic(normalized)) throw new Error("That recovery phrase isn't valid.");
      const envelope = sealVault(normalized, pin);
      await addWallet({ name, type: "mnemonic", envelope }, pin, true);
    },

    importPrivKey: async (evmKey, pin, name = "Private Key Wallet") => {
      const normalized = evmKey.trim().startsWith("0x") ? evmKey.trim() : `0x${evmKey.trim()}`;
      if (!/^0x[0-9a-fA-F]{64}$/.test(normalized)) {
        throw new Error("Invalid private key — must be 32 bytes (64 hex chars).");
      }
      const envelope = sealPrivKey(normalized, pin);
      await addWallet({ name, type: "privkey", envelope }, pin, true);
    },

    unlock: async (pin) => {
      try {
        const store = await loadStore();
        if (!store || store.wallets.length === 0) { setStatus("no-wallet"); return false; }
        const active = store.wallets.find((w) => w.id === store.activeId) ?? store.wallets[0]!;
        const payload = openEntry(active, pin);
        activateSession(active, payload);
        return true;
      } catch {
        setError("Incorrect PIN. Try again.");
        return false;
      }
    },

    lock,

    switchWallet: async (id, pin) => {
      try {
        const store = await loadStore();
        if (!store) return false;
        const target = store.wallets.find((w) => w.id === id);
        if (!target) return false;
        const payload = openEntry(target, pin);
        store.activeId = id;
        await saveStore(store);
        clearSession();
        activateSession(target, payload);
        return true;
      } catch {
        setError("Incorrect PIN. Try again.");
        return false;
      }
    },

    removeWallet: async (id) => {
      const store = await loadStore();
      if (!store) return;
      if (store.wallets.length <= 1) throw new Error("Cannot remove the last wallet.");
      if (store.activeId === id) throw new Error("Lock and switch to another wallet before removing this one.");
      store.wallets = store.wallets.filter((w) => w.id !== id);
      await saveStore(store);
      setWallets(store.wallets.map(({ id: i, name, type, createdAt }) => ({ id: i, name, type, createdAt })));
    },

    renameWallet: async (id, newName) => {
      const store = await loadStore();
      if (!store) return;
      const w = store.wallets.find((w) => w.id === id);
      if (w) w.name = newName;
      await saveStore(store);
      setWallets(store.wallets.map(({ id: i, name, type, createdAt }) => ({ id: i, name, type, createdAt })));
    },

    reset: async () => {
      clearSession();
      await kvDel(WALLETS_KEY);
      await kvDel(LEGACY_VAULT_KEY);
      setAccounts([]);
      setWallets([]);
      setActiveWalletId(null);
      setStatus("no-wallet");
    },

    dumpStore: async () => {
      const store = await loadStore();
      return store ? JSON.stringify(store) : null;
    },

    restoreFromBackup: async (storeJson: string) => {
      const store: WalletStore = JSON.parse(storeJson);
      if (!store?.wallets?.length) throw new Error("Invalid backup data.");
      await saveStore(store);
      setWallets(store.wallets.map(({ id, name, type, createdAt }) => ({ id, name, type, createdAt })));
      setActiveWalletId(store.activeId);
      setStatus("locked");
    },
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}

/** Read the current mnemonic for an explicit, gated reveal (backup/export). */
export const peekMnemonic = (): string | null => getSessionMnemonic();
