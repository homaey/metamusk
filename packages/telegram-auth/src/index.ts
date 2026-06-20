/**
 * Telegram Mini App `initData` verification (server-side ONLY).
 *
 * Telegram signs the launch parameters with a key derived from the bot token.
 * We recompute the HMAC and compare in constant time. Client-provided user data
 * is NEVER trusted until this passes.
 *
 * Algorithm (Telegram official):
 *   secret_key       = HMAC_SHA256(key="WebAppData", message=bot_token)
 *   data_check_string= "key=value\n..." for all fields except `hash`, sorted by key
 *   expected_hash    = HMAC_SHA256(key=secret_key, message=data_check_string)
 *   valid            = constantTimeEqual(expected_hash, provided hash)
 *
 * We additionally enforce an `auth_date` freshness window to limit replay.
 *
 * NOTE: bot tokens used for verification are stored only on the server (env /
 * secrets manager) and are never sent to the client.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export interface TelegramUser {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface VerifiedInitData {
  user?: TelegramUser;
  authDate: Date;
  queryId?: string;
  startParam?: string;
  /** Raw parsed fields, for any value not surfaced above. */
  raw: Record<string, string>;
}

export interface VerifyOptions {
  /** Bot token (server secret). */
  botToken: string;
  /** Max allowed age of initData in seconds. Default 24h. */
  maxAgeSeconds?: number;
  /** Override "now" for testing. */
  now?: () => number;
}

export class InitDataError extends Error {
  constructor(
    message: string,
    readonly code:
      | "missing_hash"
      | "bad_signature"
      | "expired"
      | "malformed"
      | "config",
  ) {
    super(message);
    this.name = "InitDataError";
  }
}

function constantTimeEqualHex(a: string, b: string): boolean {
  const ab = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ab.length !== bb.length || ab.length === 0) return false;
  return timingSafeEqual(ab, bb);
}

/**
 * Verify a raw `initData` query string. Returns parsed, trusted data or throws
 * an `InitDataError`. Pass the exact string Telegram provided
 * (e.g. `window.Telegram.WebApp.initData`).
 */
export function verifyInitData(
  initData: string,
  opts: VerifyOptions,
): VerifiedInitData {
  if (!opts.botToken) {
    throw new InitDataError("Bot token not configured.", "config");
  }

  let params: URLSearchParams;
  try {
    params = new URLSearchParams(initData);
  } catch {
    throw new InitDataError("initData is not a valid query string.", "malformed");
  }

  const hash = params.get("hash");
  if (!hash) throw new InitDataError("Missing hash.", "missing_hash");

  // Build the data-check-string: all fields except `hash`, sorted by key.
  const pairs: string[] = [];
  const raw: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (key === "hash") continue;
    raw[key] = value;
    pairs.push(`${key}=${value}`);
  }
  pairs.sort();
  const dataCheckString = pairs.join("\n");

  const secretKey = createHmac("sha256", "WebAppData")
    .update(opts.botToken)
    .digest();
  const expectedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  if (!constantTimeEqualHex(expectedHash, hash)) {
    throw new InitDataError("Signature verification failed.", "bad_signature");
  }

  // Freshness check.
  const authDateSec = Number(raw.auth_date);
  if (!Number.isFinite(authDateSec)) {
    throw new InitDataError("Missing or invalid auth_date.", "malformed");
  }
  const nowSec = Math.floor((opts.now?.() ?? Date.now()) / 1000);
  const maxAge = opts.maxAgeSeconds ?? 86400;
  if (nowSec - authDateSec > maxAge) {
    throw new InitDataError("initData has expired.", "expired");
  }

  let user: TelegramUser | undefined;
  if (raw.user) {
    try {
      user = JSON.parse(raw.user) as TelegramUser;
    } catch {
      throw new InitDataError("user field is not valid JSON.", "malformed");
    }
  }

  return {
    user,
    authDate: new Date(authDateSec * 1000),
    queryId: raw.query_id,
    startParam: raw.start_param,
    raw,
  };
}
