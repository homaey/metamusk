import { test } from "node:test";
import assert from "node:assert/strict";
import { sealVault, openVault, rekeyVault } from "../src/vault.js";

// Fast KDF params keep the test suite quick; production uses DEFAULT_KDF.
const FAST_KDF = { kind: "scrypt", N: 2 ** 12, r: 8, p: 1 } as const;

test("seal then open round-trips the plaintext", () => {
  const secret = JSON.stringify({ mnemonic: "alpha bravo charlie", v: 1 });
  const env = sealVault(secret, "123456", FAST_KDF);
  assert.equal(openVault(env, "123456"), secret);
});

test("each seal uses a fresh salt and nonce", () => {
  const a = sealVault("same", "123456", FAST_KDF);
  const b = sealVault("same", "123456", FAST_KDF);
  assert.notEqual(a.salt, b.salt);
  assert.notEqual(a.nonce, b.nonce);
  assert.notEqual(a.ct, b.ct);
});

test("wrong PIN fails closed", () => {
  const env = sealVault("top secret", "correct-horse", FAST_KDF);
  assert.throws(() => openVault(env, "wrong-pin"), /Unlock failed/);
});

test("tampered ciphertext is rejected by GCM auth tag", () => {
  const env = sealVault("top secret", "123456", FAST_KDF);
  // Flip a character in the base64 ciphertext.
  const bad = { ...env, ct: env.ct.slice(0, -2) + (env.ct.endsWith("A") ? "B" : "A") + "=" };
  assert.throws(() => openVault(bad, "123456"));
});

test("rekey changes the PIN while preserving plaintext", () => {
  const secret = "rotate me";
  const env = sealVault(secret, "oldpin", FAST_KDF);
  const rekeyed = rekeyVault(env, "oldpin", "newpin", FAST_KDF);
  assert.equal(openVault(rekeyed, "newpin"), secret);
  assert.throws(() => openVault(rekeyed, "oldpin"), /Unlock failed/);
});

test("rejects too-short PIN on seal", () => {
  assert.throws(() => sealVault("x", "12", FAST_KDF), /too short/);
});
