import { LOTERIA_CARDS } from "@/lib/cards";
import { CardTile } from "@/components/shared/CardTile";

interface CardGridProps {
  drawn: number[];
  lastDrawnId: number | null;
  onCardClick: (cardId: number) => void;
  searchQuery?: string;
}

export function CardGrid({ drawn, lastDrawnId, onCardClick, searchQuery = "" }: CardGridProps) {
  const drawnSet = new Set(drawn);
  const normalize = (s: string) =>
    s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const query = normalize(searchQuery.trim());

  const highlightSet = query.length > 0
    ? new Set(
        LOTERIA_CARDS
          .filter((c) => normalize(c.name).includes(query) || String(c.id).includes(query))
          .map((c) => c.id)
      )
    : null;

  return (
    <div className="grid grid-cols-6 gap-1.5">
      {LOTERIA_CARDS.map((card) => (
        <CardTile
          key={card.id}
          card={card}
          isDrawn={drawnSet.has(card.id)}
          isLastDrawn={card.id === lastDrawnId}
          isHighlighted={highlightSet ? highlightSet.has(card.id) : undefined}
          isDimmed={highlightSet ? !highlightSet.has(card.id) : undefined}
          onClick={() => onCardClick(card.id)}
        />
      ))}
    </div>
  );
}
