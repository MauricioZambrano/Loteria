import { Card } from "@/lib/cards";

interface DrawnHistoryProps {
  cards: Card[];
}

export function DrawnHistory({ cards }: DrawnHistoryProps) {
  if (cards.length === 0) {
    return (
      <div className="h-10 flex items-center">
        <p className="text-zinc-600 text-xs">Sin cartas cantadas aún.</p>
      </div>
    );
  }

  // Show newest on the right — display in draw order (oldest left, newest right)
  const visibleCards = cards.slice(-20); // cap to last 20

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {visibleCards.map((card, i) => {
        const isNewest = i === visibleCards.length - 1;
        return (
          <div
            key={`${card.id}-${i}`}
            className={[
              "flex-shrink-0 flex flex-col items-center justify-center rounded-md border px-1.5 py-1 min-w-[40px]",
              isNewest
                ? "border-yellow-400 bg-yellow-400/10"
                : "border-zinc-700 bg-zinc-800",
            ].join(" ")}
          >
            <span className="text-[10px] font-bold text-zinc-400 tabular-nums">
              {card.id}
            </span>
            <span
              className="text-[8px] text-zinc-500 text-center leading-tight"
              style={{ maxWidth: 36 }}
            >
              {card.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}
