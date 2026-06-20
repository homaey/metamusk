import { test } from "node:test";
import assert from "node:assert/strict";
import { mnemonicToSeed } from "@nova/wallet-core";
import {
  deriveSolana,
  solanaKeypair,
  deriveBitcoin,
  BitcoinProvider,
  parseUnits,
  formatUnits,
  NETWORKS,
} from "../src/index.js";

const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

test("units round-trip without float error", () => {
  assert.equal(parseUnits("1.5", 9), 1_500_000_000n);
  assert.equal(parseUnits("0.00000001", 8), 1n);
  assert.equal(formatUnits(1_500_000_000n, 9), "1.5");
  assert.equal(formatUnits(1n, 8), "0.00000001");
  assert.throws(() => parseUnits("1.234", 2), /decimal places/);
});

test("Solana keypair from derived account matches its address", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveSolana(seed, 0);
  // web3.js independently derives the same public key from our 32-byte seed.
  assert.equal(solanaKeypair(acct).publicKey.toBase58(), acct.address);
});

test("Bitcoin transfer builds, signs, and finalizes offline", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const account = deriveBitcoin(seed, 0);
  const provider = new BitcoinProvider({
    ...NETWORKS["bitcoin:mainnet"]!,
    rpcUrl: "https://mempool.space/api", // not contacted in this offline build
  });

  const result = provider.buildSignedTransfer({
    account,
    to: "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
    amountSats: 50_000n,
    feeRateSatVb: 10,
    utxos: [
      { txid: "a".repeat(64), vout: 0, value: 100_000 },
    ],
  });

  assert.ok(result.hex.length > 0, "produced signed tx hex");
  assert.match(result.txid, /^[0-9a-f]{64}$/);
  assert.ok(result.fee > 0n, "non-zero fee");
  // 100k in, 50k out, fee small → change should be present and balance.
  assert.equal(50_000n + result.fee + result.change, 100_000n);
});

test("Bitcoin transfer rejects insufficient funds", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const account = deriveBitcoin(seed, 0);
  const provider = new BitcoinProvider({
    ...NETWORKS["bitcoin:mainnet"]!,
    rpcUrl: "https://mempool.space/api",
  });
  assert.throws(
    () =>
      provider.buildSignedTransfer({
        account,
        to: "bc1qcr8te4kr609gcawutmrza0j4xv80jy8z306fyu",
        amountSats: 200_000n,
        feeRateSatVb: 10,
        utxos: [{ txid: "a".repeat(64), vout: 0, value: 100_000 }],
      }),
    /Insufficient funds/,
  );
});
