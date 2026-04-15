import { GameMode, GAME_MODE_LABELS, GAME_MODE_COLORS } from "@/lib/gameState";
import { ModeDiagram, getModePatterns } from "./ModeDiagram";

interface ModeBannerProps {
  mode: GameMode;
}

export function ModeBanner({ mode }: ModeBannerProps) {
  const patterns = getModePatterns(mode);

  return (
    <div
      className={[
        "w-full py-3 px-6 flex items-center justify-center gap-8 text-white transition-colors duration-500",
        GAME_MODE_COLORS[mode],
      ].join(" ")}
    >
      {patterns.length > 0 && (
        <div className="flex items-center gap-3">
          {patterns.slice(0, Math.ceil(patterns.length / 2)).map((cells, i) => (
            <ModeDiagram key={i} cells={cells} />
          ))}
        </div>
      )}

      <span className="font-black uppercase tracking-widest text-lg shrink-0">
        {GAME_MODE_LABELS[mode]}
      </span>

      {patterns.length > 1 && (
        <div className="flex items-center gap-3">
          {patterns.slice(Math.ceil(patterns.length / 2)).map((cells, i) => (
            <ModeDiagram key={i} cells={cells} />
          ))}
        </div>
      )}
    </div>
  );
}
