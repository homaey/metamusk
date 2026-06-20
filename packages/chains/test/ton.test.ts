import { test } from "node:test";
import assert from "node:assert/strict";
import { Address } from "@ton/core";
import { mnemonicToSeed } from "@nova/wallet-core";
import { deriveTon, buildSignedTransferBoc, tonPath } from "../src/index.js";

const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

test("derives a deterministic, valid TON address", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const a = deriveTon(seed, 0);
  const b = deriveTon(seed, 0);
  assert.equal(a.address, b.address);
  assert.equal(a.path, tonPath(0));
  assert.equal(a.publicKey.length, 32);
  // Round-trips through the TON address parser.
  assert.doesNotThrow(() => Address.parse(a.address));
});

test("different indices give different addresses", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  assert.notEqual(deriveTon(seed, 0).address, deriveTon(seed, 1).address);
});

test("builds a deterministic signed transfer BOC", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveTon(seed, 0);
  const boc1 = buildSignedTransferBoc(acct, {
    to: deriveTon(seed, 1).address,
    amountTon: "0.5",
    seqno: 0,
    comment: "gm",
  });
  const boc2 = buildSignedTransferBoc(acct, {
    to: deriveTon(seed, 1).address,
    amountTon: "0.5",
    seqno: 0,
    comment: "gm",
  });
  assert.equal(typeof boc1, "string");
  assert.ok(boc1.length > 0);
  // ed25519 signatures over identical content are deterministic.
  assert.equal(boc1, boc2);
});
