/**
 * Node-global polyfills for crypto libs (@ton/core, @solana/web3.js) that
 * reference `Buffer`/`process` at module-evaluation time.
 *
 * This MUST be the first import in the entry module. ES modules evaluate all of
 * a module's imports before its body runs, so an inline polyfill in main.tsx
 * would execute too late — by then @ton/core has already thrown. Keeping the
 * polyfill in its own module, imported before any wallet code, guarantees the
 * globals exist before those packages are evaluated.
 */
import { Buffer } from "buffer";

const g = globalThis as unknown as {
  Buffer?: typeof Buffer;
  global?: typeof globalThis;
  process?: { env: Record<string, string> };
};

if (!g.Buffer) g.Buffer = Buffer;
if (!g.global) g.global = globalThis;
if (!g.process) g.process = { env: {} };
