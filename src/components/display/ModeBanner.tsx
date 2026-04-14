import { GameMode, GAME_MODE_LABELS, GAME_MODE_COLORS } from "@/lib/gameState";

interface ModeBannerProps {
  mode: GameMode;
}

export function ModeBanner({ mode }: ModeBannerProps) {
  return (
    <div
      className={[
        "w-full py-3 text-center font-black uppercase tracking-widest text-white text-lg transition-colors duration-500",
        GAME_MODE_COLORS[mode],
      ].join(" ")}
    >
      MODO: {GAME_MODE_LABELS[mode]}
    </div>
  );
}
