import { test } from "node:test";
import assert from "node:assert/strict";
import { base58 } from "@scure/base";
import { ed25519 } from "@noble/curves/ed25519";
import { mnemonicToSeed } from "@nova/wallet-core";
import {
  deriveSolana,
  solanaPath,
  deriveBitcoin,
  bitcoinPath,
} from "../src/index.js";

// Official BIP84 test vector mnemonic.
const BIP84_MNEMONIC =
  "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";
const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

test("Bitcoin matches the official BIP84 vector (m/84'/0'/0'/0/0)", () => {
  const seed = mnemonicToSeed(BIP84_MNEMONIC);
  const acct = deriveBitcoin(seed, 0);
  assert.equal(acct.address, "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu");
  assert.equal(acct.path, bitcoinPath(0));
});

test("Bitcoin index 1 matches the BIP84 vector and differs from index 0", () => {
  const seed = mnemonicToSeed(BIP84_MNEMONIC);
  assert.equal(
    deriveBitcoin(seed, 1).address,
    "bc1qnjg0jd8228aq7egyzacy8cys3knf9xvrerkf9g",
  );
  assert.notEqual(deriveBitcoin(seed, 0).address, deriveBitcoin(seed, 1).address);
});

test("Bitcoin testnet renders a tb1 address", () => {
  const seed = mnemonicToSeed(BIP84_MNEMONIC);
  assert.ok(deriveBitcoin(seed, 0, true).address.startsWith("tb1"));
});

test("Solana address is base58 of the 32-byte ed25519 public key", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveSolana(seed, 0);
  assert.equal(acct.path, solanaPath(0));
  // Internal consistency: address decodes to exactly the derived public key.
  const decoded = base58.decode(acct.address);
  assert.equal(decoded.length, 32);
  assert.deepEqual(decoded, ed25519.getPublicKey(acct.privateKey));
  assert.deepEqual(decoded, acct.publicKey);
});

test("Solana derivation is deterministic and index-distinct", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  assert.equal(deriveSolana(seed, 0).address, deriveSolana(seed, 0).address);
  assert.notEqual(deriveSolana(seed, 0).address, deriveSolana(seed, 1).address);
});
