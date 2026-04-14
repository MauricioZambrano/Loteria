"use client";

import { CurrentCard } from "@/components/display/CurrentCard";
import { DrawnHistory } from "@/components/display/DrawnHistory";
import { ModeBanner } from "@/components/display/ModeBanner";
import { useGameState } from "@/hooks/useGameState";
import { getLastDrawn } from "@/lib/gameState";
import { CARD_BY_ID } from "@/lib/cards";

export default function DisplayPage() {
  const { gameState, isLoading } = useGameState();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <p className="text-zinc-500 text-2xl">Cargando...</p>
      </div>
    );
  }

  const lastDrawnId = getLastDrawn(gameState);
  const currentCard = lastDrawnId ? CARD_BY_ID.get(lastDrawnId) ?? null : null;
  const drawnCards = gameState.drawn
    .map((id) => CARD_BY_ID.get(id))
    .filter(Boolean) as import("@/lib/cards").Card[];

  return (
    <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden">
      <ModeBanner mode={gameState.mode} />

      <main className="flex-1 flex items-center justify-center px-4 py-2 min-h-0">
        <CurrentCard card={currentCard} />
      </main>

      <footer className="flex flex-col gap-1 px-4 py-3 bg-zinc-900 border-t border-zinc-800">
        <DrawnHistory cards={drawnCards} />
        <p className="text-right text-xs text-zinc-500">
          Cartas cantadas:{" "}
          <span className="text-zinc-300 font-bold">{gameState.drawn.length}</span>
          {" / 54"}
        </p>
      </footer>
    </div>
  );
}
