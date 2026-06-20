import { useEffect, useState } from "react";
import { haptic } from "../telegram.js";

const PIN_LENGTH = 6;

/** Numeric PIN entry. Calls onComplete once PIN_LENGTH digits are entered. */
export function PinPad({
  onComplete,
  resetSignal,
}: {
  onComplete: (pin: string) => void;
  /** Change this value to clear the current entry (e.g. after a wrong PIN). */
  resetSignal?: number;
}) {
  const [pin, setPin] = useState("");

  useEffect(() => setPin(""), [resetSignal]);

  useEffect(() => {
    if (pin.length === PIN_LENGTH) onComplete(pin);
  }, [pin]);

  const press = (d: string) => {
    haptic("light");
    setPin((p) => (p.length < PIN_LENGTH ? p + d : p));
  };
  const back = () => {
    haptic("light");
    setPin((p) => p.slice(0, -1));
  };

  return (
    <div className="pinpad">
      <div className="pin-dots">
        {Array.from({ length: PIN_LENGTH }).map((_, i) => (
          <span key={i} className={`pin-dot ${i < pin.length ? "filled" : ""}`} />
        ))}
      </div>
      <div className="pin-keys">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
          <button key={d} className="pin-key" onClick={() => press(d)}>
            {d}
          </button>
        ))}
        <span />
        <button className="pin-key" onClick={() => press("0")}>0</button>
        <button className="pin-key ghost" onClick={back} aria-label="Delete">⌫</button>
      </div>
    </div>
  );
}
