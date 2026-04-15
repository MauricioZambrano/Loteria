import Image from "next/image";
import { Card, getCardImagePath } from "@/lib/cards";

interface DrawnHistoryProps {
  cards: Card[];
}

export function DrawnHistory({ cards }: DrawnHistoryProps) {
  if (cards.length === 0) {
    return (
      <div className="h-24 flex items-center">
        <p className="text-zinc-600 text-sm">Sin cartas cantadas aún.</p>
      </div>
    );
  }

  // Show newest on the right — display in draw order (oldest left, newest right)
  const visibleCards = cards.slice(-12); // cap to last 12 at larger size

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {visibleCards.map((card, i) => {
        const isNewest = i === visibleCards.length - 1;
        return (
          <div
            key={`${card.id}-${i}`}
            className={[
              "flex-shrink-0 flex flex-col items-center rounded-lg border overflow-hidden w-16",
              isNewest
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-zinc-700 bg-zinc-800",
            ].join(" ")}
          >
            <div className="relative w-full h-20">
              <Image
                src={getCardImagePath(card)}
                alt={card.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <span className="text-[10px] text-zinc-300 text-center leading-tight px-0.5 py-0.5 w-full truncate text-center">
              {card.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
