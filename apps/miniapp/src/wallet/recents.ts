/**
 * Recent recipients per chain family — non-sensitive, used to power the
 * "first-time recipient" and address-poisoning risk checks. Stored in IndexedDB.
 */
import { kvGet, kvSet } from "./db.js";

const KEY = "recents";
type RecentsMap = Partial<Record<string, string[]>>;

export async function getRecents(family: string): Promise<string[]> {
  const map = (await kvGet<RecentsMap>(KEY)) ?? {};
  return map[family] ?? [];
}

export async function addRecent(family: string, address: string): Promise<void> {
  const map = (await kvGet<RecentsMap>(KEY)) ?? {};
  const list = map[family] ?? [];
  const next = [address, ...list.filter((a) => a.toLowerCase() !== address.toLowerCase())].slice(0, 20);
  await kvSet(KEY, { ...map, [family]: next });
}
