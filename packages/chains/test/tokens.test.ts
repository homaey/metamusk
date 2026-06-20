import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ALL_TOKENS,
  tokensForNetwork,
  searchTokens,
  NETWORKS,
} from "../src/index.js";

test("every token references a known network", () => {
  for (const tok of ALL_TOKENS) {
    assert.ok(NETWORKS[tok.networkId], `unknown network ${tok.networkId} for ${tok.symbol}`);
  }
});

test("every network has a native token, and only one", () => {
  for (const id of Object.keys(NETWORKS)) {
    if (NETWORKS[id]!.isTestnet) continue;
    const natives = tokensForNetwork(id).filter((tk) => tk.native);
    assert.equal(natives.length, 1, `network ${id} should have exactly one native token`);
    assert.equal(natives[0]!.address, null);
  }
});

test("EVM token addresses are well-formed; non-native tokens have an address", () => {
  for (const tok of ALL_TOKENS) {
    if (tok.native) continue;
    assert.ok(tok.address, `${tok.symbol} on ${tok.networkId} missing address`);
    if (tok.family === "evm") {
      assert.match(tok.address!, /^0x[0-9a-fA-F]{40}$/, `${tok.symbol} bad EVM address`);
    }
    assert.ok(tok.decimals >= 0 && tok.decimals <= 18, `${tok.symbol} bad decimals`);
  }
});

test("no duplicate (networkId, address) entries", () => {
  const seen = new Set<string>();
  for (const tok of ALL_TOKENS) {
    const key = `${tok.networkId}|${tok.address ?? "native"}`;
    assert.ok(!seen.has(key), `duplicate token ${key}`);
    seen.add(key);
  }
});

test("search matches by symbol and name, scoped by network", () => {
  assert.ok(searchTokens("usdt").length >= 3); // present on several chains
  assert.ok(searchTokens("tether", "evm:1").every((tk) => tk.networkId === "evm:1"));
  assert.equal(searchTokens("definitely-not-a-token").length, 0);
});
