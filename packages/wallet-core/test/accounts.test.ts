import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createMnemonic,
  isValidMnemonic,
  mnemonicToSeed,
} from "../src/mnemonic.js";
import { deriveEvmAccount, evmPath } from "../src/accounts.js";

// Well-known test mnemonic (Hardhat/Anvil default). NOT a real wallet — for vectors only.
const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

test("generated mnemonic is valid and 24 words by default", () => {
  const m = createMnemonic();
  assert.equal(m.split(" ").length, 24);
  assert.ok(isValidMnemonic(m));
});

test("rejects an invalid mnemonic checksum", () => {
  assert.equal(isValidMnemonic("abandon abandon abandon"), false);
});

test("derives the canonical first EVM address from the test mnemonic", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveEvmAccount(seed, 0);
  // Known vector for m/44'/60'/0'/0/0 of the Hardhat test mnemonic.
  assert.equal(acct.address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
  assert.equal(acct.path, evmPath(0));
  assert.equal(acct.privateKey.length, 32);
});

test("consecutive account indices yield distinct addresses", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const a0 = deriveEvmAccount(seed, 0).address;
  const a1 = deriveEvmAccount(seed, 1).address;
  assert.notEqual(a0, a1);
});
