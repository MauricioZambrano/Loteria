"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Card, getCardImagePath } from "@/lib/cards";

interface DrawnHistoryProps {
  cards: Card[];
}

export function DrawnHistory({ cards }: DrawnHistoryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: "smooth" });
  }, [cards.length]);

  if (cards.length === 0) {
    return (
      <div className="h-36 flex items-center">
        <p className="text-zinc-600 text-base">Sin cartas cantadas aún.</p>
      </div>
    );
  }

  const visibleCards = cards.slice(-10);

  return (
    <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
      {visibleCards.map((card, i) => {
        const isNewest = i === visibleCards.length - 1;
        return (
          <div
            key={`${card.id}-${i}`}
            className={[
              "flex-shrink-0 flex flex-col items-center rounded-lg border overflow-hidden w-24",
              isNewest
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-zinc-700 bg-zinc-800",
            ].join(" ")}
          >
            <div className="relative w-full h-32">
              <Image
                src={getCardImagePath(card)}
                alt={card.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <span className="text-xs text-zinc-300 text-center leading-tight px-1 py-1 w-full truncate">
              {card.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
