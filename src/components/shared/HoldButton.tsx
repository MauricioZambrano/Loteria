"use client";

import { useEffect, useRef, useState } from "react";

const HOLD_DURATION_MS = 1500;

interface HoldButtonProps {
  label: string;
  holdingLabel?: string;
  onConfirm: () => void;
  disabled?: boolean;
  className?: string;
  holdClassName?: string;
  fillClassName?: string;
  ariaLabel?: string;
}

export function HoldButton({
  label,
  holdingLabel = "Aguanta...",
  onConfirm,
  disabled = false,
  className = "",
  holdClassName = "",
  fillClassName = "bg-amber-500",
  ariaLabel,
}: HoldButtonProps) {
  const [progress, setProgress] = useState(0);
  const [holding, setHolding] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const firedRef = useRef(false);

  function startHold(e: React.PointerEvent<HTMLButtonElement>) {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setHolding(true);
    firedRef.current = false;
    startTimeRef.current = Date.now();

    function tick() {
      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
      const pct = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
      setProgress(pct);

      if (pct < 100) {
        rafRef.current = requestAnimationFrame(tick);
      } else if (!firedRef.current) {
        firedRef.current = true;
        onConfirm();
        cancelHold();
      }
    }

    rafRef.current = requestAnimationFrame(tick);
  }

  function cancelHold() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setHolding(false);
    setProgress(0);
    startTimeRef.current = null;
  }

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <button
      onPointerDown={startHold}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      disabled={disabled}
      aria-label={ariaLabel}
      className={[
        "relative overflow-hidden rounded-lg px-3 py-1.5 text-xs font-bold transition-colors select-none",
        holding ? holdClassName : className,
      ].join(" ")}
    >
      {holding && (
        <span
          className={["absolute inset-0 transition-none", fillClassName].join(" ")}
          style={{ width: `${progress}%` }}
        />
      )}
      <span className="relative z-10">{holding ? holdingLabel : label}</span>
    </button>
  );
}
