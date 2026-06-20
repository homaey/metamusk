/**
 * BIP39 mnemonic generation / validation / seed derivation.
 * Uses the audited @scure/bip39 implementation with the English wordlist.
 */
import {
  generateMnemonic,
  mnemonicToSeedSync,
  validateMnemonic,
} from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

/** 128 bits → 12 words; 256 bits → 24 words. We default to 24 for higher entropy. */
export type MnemonicStrength = 128 | 160 | 192 | 224 | 256;

/** Generate a fresh BIP39 mnemonic using the platform CSPRNG (via @scure). */
export function createMnemonic(strength: MnemonicStrength = 256): string {
  return generateMnemonic(wordlist, strength);
}

/** Validate a user-supplied recovery phrase (checksum + wordlist membership). */
export function isValidMnemonic(mnemonic: string): boolean {
  return validateMnemonic(normalizeMnemonic(mnemonic), wordlist);
}

/** Trim/normalize whitespace and case for import flows. */
export function normalizeMnemonic(mnemonic: string): string {
  return mnemonic.trim().toLowerCase().replace(/\s+/g, " ");
}

/**
 * Derive the 64-byte BIP39 seed. Optional `passphrase` is the BIP39 "25th word".
 * Caller should zeroize the returned seed after deriving keys from it.
 */
export function mnemonicToSeed(mnemonic: string, passphrase = ""): Uint8Array {
  const normalized = normalizeMnemonic(mnemonic);
  if (!validateMnemonic(normalized, wordlist)) {
    throw new Error("Invalid recovery phrase.");
  }
  return mnemonicToSeedSync(normalized, passphrase);
}
