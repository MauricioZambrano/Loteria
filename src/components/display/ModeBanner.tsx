import { GameMode, GAME_MODE_LABELS, GAME_MODE_COLORS } from "@/lib/gameState";
import { ModeDiagram } from "./ModeDiagram";

interface ModeBannerProps {
  mode: GameMode;
}

export function ModeBanner({ mode }: ModeBannerProps) {
  return (
    <div
      className={[
        "w-full py-3 px-6 flex items-center justify-center gap-6 text-white transition-colors duration-500",
        GAME_MODE_COLORS[mode],
      ].join(" ")}
    >
      <ModeDiagram mode={mode} />
      <span className="font-black uppercase tracking-widest text-lg">
        MODO: {GAME_MODE_LABELS[mode]}
      </span>
      <ModeDiagram mode={mode} />
    </div>
  );
}
