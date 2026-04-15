"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, getCardImagePath } from "@/lib/cards";

interface CardTileProps {
  card: Card;
  isDrawn: boolean;
  isLastDrawn: boolean;
  onClick?: () => void;
  size?: "sm" | "md";
  isHighlighted?: boolean;
  isDimmed?: boolean;
}

export function CardTile({
  card,
  isDrawn,
  isLastDrawn,
  onClick,
  size = "md",
  isHighlighted,
  isDimmed,
}: CardTileProps) {
  const [imgError, setImgError] = useState(false);
  const isSmall = size === "sm";

  return (
    <button
      onClick={onClick}
      disabled={isDrawn}
      aria-label={`${card.id} - ${card.name}${isDrawn ? " (cantada)" : ""}`}
      className={[
        "flex flex-col items-center justify-center rounded-lg border transition-all select-none overflow-hidden",
        isSmall ? "p-0.5 gap-0" : "p-1 gap-0.5",
        isLastDrawn
          ? "border-yellow-400 bg-yellow-400/10 ring-2 ring-yellow-400"
          : isDrawn
          ? "border-zinc-700 bg-zinc-800 opacity-40 cursor-not-allowed"
          : isHighlighted
          ? "border-blue-400 bg-blue-400/10 ring-2 ring-blue-400 hover:bg-blue-400/20 active:scale-95 cursor-pointer"
          : isDimmed
          ? "border-zinc-700 bg-zinc-800 opacity-30 cursor-pointer"
          : "border-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-400 active:scale-95 cursor-pointer",
      ].join(" ")}
    >
      {/* Card image */}
      {!imgError ? (
        <div className={["relative w-full", isSmall ? "h-10" : "h-14"].join(" ")}>
          <span className="absolute top-0.5 left-0.5 z-10 text-[9px] font-bold leading-none tabular-nums text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            {card.id}
          </span>
          <Image
            src={getCardImagePath(card)}
            alt={card.name}
            fill
            loading="eager"
            className={["object-contain", isDrawn && !isLastDrawn ? "grayscale" : ""].join(" ")}
            onError={() => setImgError(true)}
            sizes="80px"
          />
        </div>
      ) : (
        /* Text fallback if image fails to load */
        <span
          className={[
            "font-bold leading-none tabular-nums",
            isSmall ? "text-xs" : "text-base",
            isDrawn && !isLastDrawn ? "text-zinc-500" : "text-zinc-100",
          ].join(" ")}
        >
          {card.id}
        </span>
      )}
      <span
        className={[
          "text-center leading-tight w-full truncate px-0.5",
          isSmall ? "text-[8px]" : "text-[9px]",
          isDrawn && !isLastDrawn ? "text-zinc-600" : "text-zinc-400",
        ].join(" ")}
      >
        {card.name}
      </span>
    </button>
  );
}
