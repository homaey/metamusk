/**
 * Bitcoin account derivation (BIP84 native SegWit, P2WPKH / bech32 `bc1…`).
 * Reuses the shared secp256k1 BIP32 derivation from @nova/wallet-core, then
 * renders a native-segwit address via the audited @scure/btc-signer.
 */
import { deriveSecp256k1 } from "@nova/wallet-core";
import { p2wpkh, NETWORK, TEST_NETWORK } from "@scure/btc-signer";
import type { DerivedAccount } from "../types.js";

/** BIP84 account path. Receiving chain (0), address index i. */
export function bitcoinPath(accountIndex: number): string {
  if (!Number.isInteger(accountIndex) || accountIndex < 0) {
    throw new Error("accountIndex must be a non-negative integer.");
  }
  return `m/84'/0'/0'/0/${accountIndex}`;
}

export interface BitcoinAccount extends DerivedAccount {
  isTestnet: boolean;
}

/** Derive the i-th Bitcoin native-segwit account from a BIP39 seed. */
export function deriveBitcoin(
  seed: Uint8Array,
  accountIndex: number,
  isTestnet = false,
): BitcoinAccount {
  const key = deriveSecp256k1(seed, bitcoinPath(accountIndex));
  const payment = p2wpkh(key.publicKey, isTestnet ? TEST_NETWORK : NETWORK);
  if (!payment.address) throw new Error("Failed to derive Bitcoin address.");
  return {
    family: "bitcoin",
    path: key.path,
    address: payment.address,
    publicKey: key.publicKey,
    privateKey: key.privateKey,
    isTestnet,
  };
}
