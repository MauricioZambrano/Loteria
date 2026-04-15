"use client";

import { HoldButton } from "@/components/shared/HoldButton";

interface UndoButtonProps {
  disabled: boolean;
  onUndo: () => void;
}

export function UndoButton({ disabled, onUndo }: UndoButtonProps) {
  return (
    <HoldButton
      label="↩ Deshacer"
      onConfirm={onUndo}
      disabled={disabled}
      ariaLabel="Deshacer última carta (mantén presionado)"
      className={disabled ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-zinc-700 text-amber-300 hover:bg-zinc-600"}
      holdClassName="bg-amber-600 text-white"
      fillClassName="bg-amber-500"
    />
  );
}
