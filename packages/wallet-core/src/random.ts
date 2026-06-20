/**
 * Cryptographically secure randomness. Uses the platform CSPRNG
 * (WebCrypto getRandomValues) which is available in modern browsers and Node 20+.
 */

function getCrypto(): Crypto {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (!c || typeof c.getRandomValues !== "function") {
    throw new Error("Secure RNG unavailable: WebCrypto getRandomValues is required.");
  }
  return c;
}

/** Return `length` cryptographically random bytes. */
export function randomBytes(length: number): Uint8Array {
  if (!Number.isInteger(length) || length <= 0) {
    throw new Error("randomBytes: length must be a positive integer.");
  }
  const out = new Uint8Array(length);
  getCrypto().getRandomValues(out);
  return out;
}
