"use client";

import { CardGrid } from "@/components/admin/CardGrid";
import { ModeSelector } from "@/components/admin/ModeSelector";
import { UndoButton } from "@/components/admin/UndoButton";
import { useAdmin } from "@/hooks/useAdmin";
import { useGameState } from "@/hooks/useGameState";

export default function AdminPage() {
  const { gameState, isLoading } = useGameState();
  const { drawCard, undoCard, setMode } = useAdmin(gameState);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-400 text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky header: mode selector + undo */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-zinc-900 border-b border-zinc-800 px-3 py-2">
        <ModeSelector currentMode={gameState.mode} onModeChange={setMode} />
        <UndoButton
          disabled={gameState.drawn.length === 0}
          onUndo={undoCard}
        />
      </header>

      {/* Card count */}
      <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400">
        Cartas cantadas:{" "}
        <span className="font-bold text-zinc-200">{gameState.drawn.length}</span>
        {" / 54"}
      </div>

      {/* Card grid */}
      <main className="flex-1 overflow-y-auto p-2">
        <CardGrid
          drawn={gameState.drawn}
          lastDrawnId={
            gameState.drawn.length > 0
              ? gameState.drawn[gameState.drawn.length - 1]
              : null
          }
          onCardClick={drawCard}
        />
      </main>
    </div>
  );
}
