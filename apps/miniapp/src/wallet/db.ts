/**
 * Minimal IndexedDB key-value store (no dependency). Used ONLY to persist the
 * encrypted vault envelope and non-sensitive metadata. Never stores plaintext
 * secrets — the envelope is already AES-256-GCM sealed by @nova/wallet-core.
 */
const DB_NAME = "metamusk-wallet";
const STORE = "kv";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const store = db.transaction(STORE, mode).objectStore(STORE);
    const req = fn(store);
    req.onsuccess = () => resolve(req.result as T);
    req.onerror = () => reject(req.error);
  });
}

export const kvGet = <T>(key: string): Promise<T | undefined> =>
  tx<T | undefined>("readonly", (s) => s.get(key));

export const kvSet = (key: string, value: unknown): Promise<void> =>
  tx<void>("readwrite", (s) => s.put(value, key));

export const kvDel = (key: string): Promise<void> =>
  tx<void>("readwrite", (s) => s.delete(key));
