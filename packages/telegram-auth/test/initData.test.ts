import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyInitData, InitDataError } from "../src/index.js";

const BOT_TOKEN = "123456:TEST_BOT_TOKEN_do_not_use";

/** Produce a valid signed initData string the way Telegram would. */
function signInitData(fields: Record<string, string>): string {
  const pairs = Object.entries(fields)
    .map(([k, v]) => `${k}=${v}`)
    .sort();
  const dataCheckString = pairs.join("\n");
  const secret = createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const hash = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  const params = new URLSearchParams({ ...fields, hash });
  return params.toString();
}

const NOW = 1_700_000_000_000; // fixed clock (ms)
const freshAuthDate = String(Math.floor(NOW / 1000) - 10);

test("accepts a correctly signed, fresh initData", () => {
  const initData = signInitData({
    auth_date: freshAuthDate,
    query_id: "AAEx",
    user: JSON.stringify({ id: 42, username: "satoshi", language_code: "en" }),
  });
  const result = verifyInitData(initData, { botToken: BOT_TOKEN, now: () => NOW });
  assert.equal(result.user?.id, 42);
  assert.equal(result.user?.username, "satoshi");
  assert.equal(result.queryId, "AAEx");
});

test("rejects a forged hash", () => {
  const initData = signInitData({ auth_date: freshAuthDate, user: '{"id":1}' });
  const tampered = initData.replace(/hash=[0-9a-f]+/, "hash=" + "0".repeat(64));
  assert.throws(
    () => verifyInitData(tampered, { botToken: BOT_TOKEN, now: () => NOW }),
    (e: unknown) => e instanceof InitDataError && e.code === "bad_signature",
  );
});

test("rejects a tampered field (signature no longer matches)", () => {
  const initData = signInitData({
    auth_date: freshAuthDate,
    user: JSON.stringify({ id: 42 }),
  });
  // Swap the user id without re-signing.
  const tampered = initData.replace("%22id%22%3A42", "%22id%22%3A999");
  assert.throws(
    () => verifyInitData(tampered, { botToken: BOT_TOKEN, now: () => NOW }),
    (e: unknown) => e instanceof InitDataError && e.code === "bad_signature",
  );
});

test("rejects expired initData", () => {
  const old = String(Math.floor(NOW / 1000) - 100_000);
  const initData = signInitData({ auth_date: old, user: '{"id":1}' });
  assert.throws(
    () =>
      verifyInitData(initData, {
        botToken: BOT_TOKEN,
        maxAgeSeconds: 3600,
        now: () => NOW,
      }),
    (e: unknown) => e instanceof InitDataError && e.code === "expired",
  );
});

test("rejects missing hash", () => {
  assert.throws(
    () => verifyInitData("auth_date=1&user=%7B%7D", { botToken: BOT_TOKEN, now: () => NOW }),
    (e: unknown) => e instanceof InitDataError && e.code === "missing_hash",
  );
});

test("rejects when bot token is not configured", () => {
  assert.throws(
    () => verifyInitData("hash=x", { botToken: "" }),
    (e: unknown) => e instanceof InitDataError && e.code === "config",
  );
});
