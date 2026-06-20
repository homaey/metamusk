/**
 * Small isomorphic byte/encoding helpers. No secrets are logged here; callers
 * are responsible for zeroizing sensitive Uint8Arrays after use.
 */

const hasBuffer = typeof globalThis.Buffer !== "undefined";

/** Encode bytes to standard base64 (browser + Node). */
export function bytesToBase64(bytes: Uint8Array): string {
  if (hasBuffer) return globalThis.Buffer.from(bytes).toString("base64");
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary);
}

/** Decode standard base64 to bytes (browser + Node). */
export function base64ToBytes(b64: string): Uint8Array {
  if (hasBuffer) return new Uint8Array(globalThis.Buffer.from(b64, "base64"));
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const utf8ToBytes = (s: string): Uint8Array => encoder.encode(s);
export const bytesToUtf8 = (b: Uint8Array): string => decoder.decode(b);

/**
 * Best-effort in-place wipe of sensitive data. JS cannot guarantee memory is
 * cleared (GC, string immutability), but zeroizing the buffers we control
 * meaningfully shrinks the window a secret is recoverable.
 */
export function zeroize(...buffers: (Uint8Array | undefined | null)[]): void {
  for (const b of buffers) {
    if (b) b.fill(0);
  }
}
