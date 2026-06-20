import { test } from "node:test";
import assert from "node:assert/strict";
import { mnemonicToSeed } from "@nova/wallet-core";
import {
  isValidAddress,
  assessTransferRisk,
  deriveEvm,
  deriveTon,
  deriveSolana,
  deriveBitcoin,
} from "../src/index.js";

const seed = mnemonicToSeed("test test test test test test test test test test test junk");
const evm = deriveEvm(seed, 0).address;
const ton = deriveTon(seed, 0).address;
const sol = deriveSolana(seed, 0).address;
const btc = deriveBitcoin(seed, 0).address;

test("validates real derived addresses per family", () => {
  assert.ok(isValidAddress("evm", evm));
  assert.ok(isValidAddress("ton", ton));
  assert.ok(isValidAddress("solana", sol));
  assert.ok(isValidAddress("bitcoin", btc));
});

test("rejects malformed and cross-family addresses", () => {
  assert.equal(isValidAddress("evm", "0x1234"), false);
  assert.equal(isValidAddress("evm", ""), false);
  assert.equal(isValidAddress("solana", evm), false); // EVM hex isn't 32-byte base58
  assert.equal(isValidAddress("bitcoin", evm), false);
});

test("invalid address is a red, blocking finding", () => {
  const r = assessTransferRisk({ family: "evm", from: evm, to: "0xnotvalid" });
  assert.equal(r.level, "red");
  assert.equal(r.canProceed, false);
  assert.equal(r.findings[0]!.code, "invalid_address");
});

test("first-time recipient is a yellow, non-blocking warning", () => {
  const r = assessTransferRisk({
    family: "evm",
    from: evm,
    to: deriveEvm(seed, 1).address,
    knownRecipients: [deriveEvm(seed, 2).address],
  });
  assert.equal(r.level, "yellow");
  assert.equal(r.canProceed, true);
  assert.ok(r.findings.some((f) => f.code === "first_time_recipient"));
});

test("self-send and contract recipient are flagged", () => {
  const r = assessTransferRisk({ family: "evm", from: evm, to: evm, recipientIsContract: true });
  assert.ok(r.findings.some((f) => f.code === "self_send"));
  assert.ok(r.findings.some((f) => f.code === "contract_recipient"));
});

test("network mismatch (wrong-family address) is red and blocking", () => {
  const r = assessTransferRisk({ family: "evm", from: evm, to: evm, detectedFamily: "solana" });
  assert.equal(r.level, "red");
  assert.ok(r.findings.some((f) => f.code === "network_mismatch"));
});

test("address-poisoning look-alike is detected", () => {
  // Build a fake that shares prefix+suffix with a known recipient.
  const known = "0xabcdef0000000000000000000000000000abcdef";
  const poison = "0xabcdef1111111111111111111111111111abcdef";
  const r = assessTransferRisk({ family: "evm", from: evm, to: poison, knownRecipients: [known] });
  assert.ok(r.findings.some((f) => f.code === "address_poisoning"));
  assert.equal(r.level, "red");
});

test("clean known recipient is green and proceeds", () => {
  const to = deriveEvm(seed, 3).address;
  const r = assessTransferRisk({ family: "evm", from: evm, to, knownRecipients: [to] });
  assert.equal(r.level, "green");
  assert.equal(r.canProceed, true);
  assert.equal(r.findings.length, 0);
});
