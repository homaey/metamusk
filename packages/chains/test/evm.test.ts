import { test } from "node:test";
import assert from "node:assert/strict";
import { mnemonicToSeed } from "@nova/wallet-core";
import { deriveEvm, evmSigner, EvmProvider } from "../src/index.js";
import type { NetworkConfig } from "../src/types.js";

const TEST_MNEMONIC =
  "test test test test test test test test test test test junk";

const NET: NetworkConfig = {
  id: "evm:8453",
  family: "evm",
  name: "Base",
  nativeSymbol: "ETH",
  nativeDecimals: 18,
  chainId: 8453,
  rpcUrl: "http://localhost:8545", // not contacted in these offline tests
  isTestnet: false,
};

test("derives the canonical EVM address from the shared seed", () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveEvm(seed, 0);
  assert.equal(acct.address, "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
});

test("build → sign → recover yields the signing account (offline)", async () => {
  const seed = mnemonicToSeed(TEST_MNEMONIC);
  const acct = deriveEvm(seed, 0);
  const signer = evmSigner(acct);
  const provider = new EvmProvider(NET);

  const tx = provider.buildNativeTransfer({
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    amountEth: "0.01",
    nonce: 0,
    chainId: 8453,
    maxFeePerGas: 2_000_000_000n,
    maxPriorityFeePerGas: 1_000_000_000n,
  });

  const signed = await EvmProvider.sign(signer, tx);
  const sender = await EvmProvider.senderOf(signed);
  assert.equal(sender.toLowerCase(), acct.address.toLowerCase());
});
