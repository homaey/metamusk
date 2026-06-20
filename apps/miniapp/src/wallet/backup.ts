/**
 * Cloud Backup — encrypts the full WalletStore with a user-chosen backup
 * password and uploads to Telegram CloudStorage (tied to user's Telegram
 * account). Non-custodial: Telegram never sees the plaintext.
 *
 * Encryption: Argon2id key derivation + AES-256-GCM (same as vault).
 * Backup password is separate from PIN so it can be used on a fresh device.
 */
import { sealVault, openVault, type VaultEnvelope } from "@nova/wallet-core";
import { getCloudStorage } from "../telegram.js";

const BACKUP_KEY = "metamusk-backup-v1";

function cs() {
  return getCloudStorage();
}

function csSet(key: string, value: string): Promise<void> {
  return new Promise((res, rej) => {
    const storage = cs();
    if (!storage) return rej(new Error("CloudStorage unavailable"));
    storage.setItem(key, value, (e) => (e ? rej(e) : res()));
  });
}

function csGet(key: string): Promise<string> {
  return new Promise((res, rej) => {
    const storage = cs();
    if (!storage) return rej(new Error("CloudStorage unavailable"));
    storage.getItem(key, (e, v) => (e ? rej(e) : res(v ?? "")));
  });
}

function csRemove(key: string): Promise<void> {
  return new Promise((res) => {
    const storage = cs();
    if (!storage) return res();
    storage.removeItem(key, () => res());
  });
}

export async function hasCloudBackup(): Promise<boolean> {
  if (!cs()) return false;
  try {
    const val = await csGet(BACKUP_KEY);
    return val.length > 0;
  } catch {
    return false;
  }
}

export async function createCloudBackup(storeJson: string, password: string): Promise<void> {
  if (!cs()) throw new Error("Telegram CloudStorage is not available in this environment.");
  const envelope = sealVault(storeJson, password);
  const payload = JSON.stringify(envelope);
  if (payload.length > 4000) throw new Error("Backup is too large for Telegram CloudStorage (max 4 KB).");
  await csSet(BACKUP_KEY, payload);
}

export async function restoreCloudBackup(password: string): Promise<string> {
  if (!cs()) throw new Error("Telegram CloudStorage is not available.");
  const raw = await csGet(BACKUP_KEY);
  if (!raw) throw new Error("No backup found in your Telegram account.");
  const envelope: VaultEnvelope = JSON.parse(raw);
  // openVault throws if password is wrong — let the caller catch it
  return openVault(envelope, password);
}

export async function deleteCloudBackup(): Promise<void> {
  await csRemove(BACKUP_KEY);
}

/** Validate backup password strength. Returns list of unmet requirements (empty = ok). */
export function validateBackupPassword(pw: string, confirm?: string): string[] {
  const issues: string[] = [];
  if (pw.length < 8) issues.push("min8");
  if (!/[a-zA-Z]/.test(pw)) issues.push("hasLetters");
  if (!/[0-9]/.test(pw)) issues.push("hasNumbers");
  if (confirm !== undefined && pw !== confirm) issues.push("match");
  return issues;
}
