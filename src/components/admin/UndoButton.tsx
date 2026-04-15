"use client";

import { useEffect, useRef, useState } from "react";

const HOLD_DURATION_MS = 1500;

interface UndoButtonProps {
  disabled: boolean;
  onUndo: () => void;
}

export function UndoButton({ disabled, onUndo }: UndoButtonProps) {
  const [progress, setProgress] = useState(0); // 0–100
  const [holding, setHolding] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const firedRef = useRef(false);

  function startHold(e: React.PointerEvent<HTMLButtonElement>) {
    if (disabled) return;
    // Capture pointer so onPointerLeave doesn't fire if finger drifts slightly
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
        onUndo();
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
      onPointerDown={(e) => startHold(e)}
      onPointerUp={cancelHold}
      onPointerLeave={cancelHold}
      disabled={disabled}
      aria-label="Deshacer última carta (mantén presionado)"
      className={[
        "relative overflow-hidden rounded-lg px-3 py-1.5 text-xs font-bold transition-colors select-none",
        disabled
          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          : holding
          ? "bg-amber-600 text-white"
          : "bg-zinc-700 text-amber-300 hover:bg-zinc-600",
      ].join(" ")}
    >
      {/* Progress fill */}
      {holding && (
        <span
          className="absolute inset-0 bg-amber-500 transition-none"
          style={{ width: `${progress}%` }}
        />
      )}
      <span className="relative z-10">
        {holding ? "Aguanta..." : "↩ Deshacer"}
      </span>
    </button>
  );
}
