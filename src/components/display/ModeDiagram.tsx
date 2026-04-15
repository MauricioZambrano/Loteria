import { GameMode } from "@/lib/gameState";

// All winning cell patterns per mode. Each inner array is one valid combination.
// Cells are 0–15 in row-major order on a 4×4 board.
const MODE_PATTERNS: Record<GameMode, number[][]> = {
  libre:    [],
  fila:     [[0,1,2,3], [4,5,6,7], [8,9,10,11], [12,13,14,15]],
  columna:  [[0,4,8,12], [1,5,9,13], [2,6,10,14], [3,7,11,15]],
  diagonal: [[0,5,10,15], [3,6,9,12]],
  esquinas: [[0,3,12,15]],
  loteria:  [[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]],
};

export function getModePatterns(mode: GameMode): number[][] {
  return MODE_PATTERNS[mode] ?? [];
}

interface ModeDiagramProps {
  cells: number[];
}

export function ModeDiagram({ cells }: ModeDiagramProps) {
  const highlighted = new Set(cells);

  return (
    <div className="grid grid-cols-4 gap-1">
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={i}
          className={[
            "w-4 h-4 rounded-sm",
            highlighted.has(i) ? "bg-white/90" : "bg-black/30",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
