import { LOTERIA_CARDS } from "@/lib/cards";
import { CardTile } from "@/components/shared/CardTile";

interface CardGridProps {
  drawn: number[];
  lastDrawnId: number | null;
  onCardClick: (cardId: number) => void;
}

export function CardGrid({ drawn, lastDrawnId, onCardClick }: CardGridProps) {
  const drawnSet = new Set(drawn);

  return (
    <div className="grid grid-cols-6 gap-1.5">
      {LOTERIA_CARDS.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          isDrawn={drawnSet.has(card.id)}
          isLastDrawn={card.id === lastDrawnId}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
}
