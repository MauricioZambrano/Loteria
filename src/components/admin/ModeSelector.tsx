import { GameMode, GAME_MODE_LABELS } from "@/lib/gameState";

const MODES: GameMode[] = ["fila", "columna", "diagonal", "esquinas", "loteria", "libre"];

const MODE_ACTIVE_COLORS: Record<GameMode, string> = {
  libre:    "bg-zinc-400 text-zinc-900",
  fila:     "bg-blue-500 text-white",
  columna:  "bg-purple-500 text-white",
  diagonal: "bg-orange-500 text-white",
  esquinas: "bg-green-500 text-white",
  loteria:  "bg-red-500 text-white",
};

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
            "rounded px-2 py-0.5 text-xs font-semibold transition-all",
            currentMode === mode
              ? MODE_ACTIVE_COLORS[mode]
              : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600",
          ].join(" ")}
        >
          {GAME_MODE_LABELS[mode]}
        </button>
      ))}
    </div>
  );
}
