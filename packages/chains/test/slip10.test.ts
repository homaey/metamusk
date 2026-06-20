import { test } from "node:test";
import assert from "node:assert/strict";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { ed25519 } from "@noble/curves/ed25519";
import { deriveEd25519, parseHardenedPath } from "../src/slip10.js";

// Official SLIP-0010 ed25519 Test Vector 1.
const SEED = hexToBytes("000102030405060708090a0b0c0d0e0f");

test("master node matches SLIP-0010 ed25519 vector", () => {
  const m = deriveEd25519(SEED, "m");
  assert.equal(
    bytesToHex(m.key),
    "2b4be7f19ee27bbf30c667b642d5f4aa69fd169872f8fc3059c08ebae2eb19e7",
  );
  assert.equal(
    bytesToHex(m.chainCode),
    "90046a93de5380a72b5e45010748567d5ea02bbf6522f979e05c0d8d8ca9fffb",
  );
  // Public key (SLIP-0010 prefixes ed25519 pubkeys with 0x00).
  assert.equal(
    bytesToHex(ed25519.getPublicKey(m.key)),
    "a4b2856bfec510abab89753fac1ac0e1112364e7d250545963f135f2a33188ed",
  );
});

test("m/0' matches SLIP-0010 ed25519 vector", () => {
  const node = deriveEd25519(SEED, "m/0'");
  assert.equal(
    bytesToHex(node.key),
    "68e0fe46dfb67e368c75379acec591dad19df3cde26e63b93a8e704f1dade7a3",
  );
  assert.equal(
    bytesToHex(node.chainCode),
    "8b59aa11380b624e81507a27fedda59fea6d0b779a778918a2fd3590e16e9c69",
  );
});

test("non-hardened segments are rejected for ed25519", () => {
  assert.throws(() => parseHardenedPath("m/44'/607'/0"), /hardened/);
});
