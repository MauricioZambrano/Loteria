import { GameMode } from "@/lib/gameState";

// 4×4 grid, cells 0–15 in row-major order.
// Each entry is the set of cells that should be highlighted for that mode.
const PATTERNS: Record<GameMode, number[]> = {
  libre:    [],
  fila:     [4, 5, 6, 7],                                          // middle row
  columna:  [1, 5, 9, 13],                                         // second column
  diagonal: [0, 5, 10, 15, 3, 6, 9, 12],                          // both diagonals
  esquinas: [0, 3, 12, 15],                                        // 4 corners
  loteria:  [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],              // full board
};

interface ModeDiagramProps {
  mode: GameMode;
}

export function ModeDiagram({ mode }: ModeDiagramProps) {
  const highlighted = new Set(PATTERNS[mode]);
  if (highlighted.size === 0) return null;

  return (
    <div className="grid grid-cols-4 gap-1.5">
      {Array.from({ length: 16 }, (_, i) => (
        <div
          key={i}
          className={[
            "w-5 h-5 rounded-sm",
            highlighted.has(i) ? "bg-white/90" : "bg-black/30",
          ].join(" ")}
        />
      ))}
    </div>
  );
}
