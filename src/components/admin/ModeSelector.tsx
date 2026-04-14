import { GameMode, GAME_MODE_LABELS } from "@/lib/gameState";

const MODES: GameMode[] = [
  "libre",
  "fila",
  "columna",
  "diagonal",
  "esquinas",
  "loteria",
];

interface ModeSelectorProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {MODES.map((mode) => (
        <button
          key={mode}
          onClick={() => onModeChange(mode)}
          className={[
            "rounded-full px-2.5 py-1 text-xs font-semibold transition-all",
            currentMode === mode
              ? "bg-zinc-100 text-zinc-900"
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600",
          ].join(" ")}
        >
          {GAME_MODE_LABELS[mode]}
        </button>
      ))}
    </div>
  );
}
