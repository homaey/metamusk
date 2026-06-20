/**
 * Encrypted vault.
 *
 * Seals arbitrary plaintext (a serialized wallet: mnemonic/keys/metadata) under a
 * key derived from the user's PIN/passphrase. At rest it is an authenticated
 * ciphertext; tampering or a wrong PIN fails closed (decryption throws).
 *
 *   PIN ──KDF(Argon2id|scrypt)──► 32-byte key ──AES-256-GCM──► sealed envelope
 *
 * This module performs NO network or storage I/O. The caller decides where the
 * (already-encrypted) envelope is persisted, and must `zeroize` plaintext after use.
 */
import { argon2id } from "@noble/hashes/argon2";
import { scrypt } from "@noble/hashes/scrypt";
import { gcm } from "@noble/ciphers/aes";
import { randomBytes } from "./random.js";
import { base64ToBytes, bytesToBase64, utf8ToBytes, zeroize } from "./bytes.js";

const SALT_LEN = 16;
const NONCE_LEN = 12; // GCM standard
const KEY_LEN = 32; // AES-256
const ENVELOPE_VERSION = 1;

export type Argon2idParams = {
  kind: "argon2id";
  /** iterations (time cost) */
  t: number;
  /** memory cost in KiB */
  m: number;
  /** parallelism */
  p: number;
};

export type ScryptParams = {
  kind: "scrypt";
  N: number;
  r: number;
  p: number;
};

export type KdfParams = Argon2idParams | ScryptParams;

/** Conservative interactive defaults: ~64 MiB Argon2id. Tune per device class. */
export const DEFAULT_KDF: Argon2idParams = { kind: "argon2id", t: 3, m: 64 * 1024, p: 1 };

/** Versioned, self-describing envelope. Safe to persist; contains no plaintext. */
export interface VaultEnvelope {
  v: number;
  kdf: KdfParams;
  salt: string; // base64
  nonce: string; // base64
  ct: string; // base64 ciphertext (includes GCM auth tag)
}

function deriveKey(pin: string, salt: Uint8Array, kdf: KdfParams): Uint8Array {
  const pwd = utf8ToBytes(pin);
  try {
    if (kdf.kind === "argon2id") {
      return argon2id(pwd, salt, { t: kdf.t, m: kdf.m, p: kdf.p, dkLen: KEY_LEN });
    }
    return scrypt(pwd, salt, { N: kdf.N, r: kdf.r, p: kdf.p, dkLen: KEY_LEN });
  } finally {
    zeroize(pwd);
  }
}

/**
 * Encrypt `plaintext` (UTF-8 string) under `pin`. Returns a persistable envelope.
 * Each call uses a fresh random salt + nonce.
 */
export function sealVault(
  plaintext: string,
  pin: string,
  kdf: KdfParams = DEFAULT_KDF,
): VaultEnvelope {
  if (!pin || pin.length < 4) {
    throw new Error("sealVault: PIN/passphrase too short.");
  }
  const salt = randomBytes(SALT_LEN);
  const nonce = randomBytes(NONCE_LEN);
  const key = deriveKey(pin, salt, kdf);
  const data = utf8ToBytes(plaintext);
  try {
    const ct = gcm(key, nonce).encrypt(data);
    return {
      v: ENVELOPE_VERSION,
      kdf,
      salt: bytesToBase64(salt),
      nonce: bytesToBase64(nonce),
      ct: bytesToBase64(ct),
    };
  } finally {
    zeroize(key, data);
  }
}

/**
 * Decrypt an envelope with `pin`. Throws on wrong PIN or tampered ciphertext
 * (GCM authentication failure) — callers should treat any throw as "unlock failed".
 * Returns the plaintext UTF-8 string.
 */
export function openVault(envelope: VaultEnvelope, pin: string): string {
  if (envelope.v !== ENVELOPE_VERSION) {
    throw new Error(`openVault: unsupported envelope version ${envelope.v}.`);
  }
  const salt = base64ToBytes(envelope.salt);
  const nonce = base64ToBytes(envelope.nonce);
  const ct = base64ToBytes(envelope.ct);
  const key = deriveKey(pin, salt, envelope.kdf);
  try {
    const pt = gcm(key, nonce).decrypt(ct); // throws if auth tag invalid
    const text = new TextDecoder().decode(pt);
    zeroize(pt);
    return text;
  } catch {
    // Normalize to avoid leaking which step failed.
    throw new Error("Unlock failed: incorrect PIN or corrupted vault.");
  } finally {
    zeroize(key);
  }
}

/** Re-encrypt a vault under a new PIN/KDF (used for "change PIN"). */
export function rekeyVault(
  envelope: VaultEnvelope,
  oldPin: string,
  newPin: string,
  kdf: KdfParams = DEFAULT_KDF,
): VaultEnvelope {
  const plaintext = openVault(envelope, oldPin);
  try {
    return sealVault(plaintext, newPin, kdf);
  } finally {
    // plaintext is an immutable JS string; cannot wipe, but minimize its lifetime.
  }
}
