import { Card } from "@/lib/cards";

interface CardTileProps {
  card: Card;
  isDrawn: boolean;
  isLastDrawn: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
}

export function CardTile({
  card,
  isDrawn,
  isLastDrawn,
  onClick,
  size = "md",
}: CardTileProps) {
  const isSmall = size === "sm";

  return (
    <button
      onClick={onClick}
      disabled={isDrawn}
      aria-label={`${card.id} - ${card.name}${isDrawn ? " (cantada)" : ""}`}
      className={[
        "flex flex-col items-center justify-center rounded-lg border transition-all select-none",
        isSmall ? "p-1 gap-0.5" : "p-2 gap-1",
        isLastDrawn
          ? "border-yellow-400 bg-yellow-400/10 ring-2 ring-yellow-400"
          : isDrawn
          ? "border-zinc-700 bg-zinc-800 opacity-40 cursor-not-allowed"
          : "border-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-400 active:scale-95 cursor-pointer",
      ].join(" ")}
    >
      <span
        className={[
          "font-bold leading-none tabular-nums",
          isSmall ? "text-xs" : "text-base",
          isDrawn && !isLastDrawn ? "text-zinc-500" : "text-zinc-100",
        ].join(" ")}
      >
        {card.id}
      </span>
      <span
        className={[
          "text-center leading-tight",
          isSmall ? "text-[9px]" : "text-[10px]",
          isDrawn && !isLastDrawn ? "text-zinc-600" : "text-zinc-400",
        ].join(" ")}
        style={{ wordBreak: "break-word" }}
      >
        {card.name}
      </span>
    </button>
  );
}
