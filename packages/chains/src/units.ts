/**
 * Decimal <-> smallest-unit conversion using BigInt string math (no floats),
 * so amounts never lose precision. Used for SOL (9), BTC (8), and any token.
 */

/** Parse a human decimal string (e.g. "1.5") into the smallest unit. */
export function parseUnits(amount: string, decimals: number): bigint {
  if (!/^\d+(\.\d+)?$/.test(amount.trim())) {
    throw new Error(`Invalid amount: ${amount}`);
  }
  const [whole, frac = ""] = amount.trim().split(".");
  if (frac.length > decimals) {
    throw new Error(`Amount has more than ${decimals} decimal places.`);
  }
  const padded = frac.padEnd(decimals, "0");
  return BigInt(whole + padded);
}

/** Format a smallest-unit value back to a human decimal string. */
export function formatUnits(value: bigint, decimals: number): string {
  const neg = value < 0n;
  const v = neg ? -value : value;
  const s = v.toString().padStart(decimals + 1, "0");
  const whole = s.slice(0, s.length - decimals);
  const frac = s.slice(s.length - decimals).replace(/0+$/, "");
  return (neg ? "-" : "") + (frac ? `${whole}.${frac}` : whole);
}
