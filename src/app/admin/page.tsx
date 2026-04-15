"use client";

import { useState } from "react";
import { CardGrid } from "@/components/admin/CardGrid";
import { ModeSelector } from "@/components/admin/ModeSelector";
import { UndoButton } from "@/components/admin/UndoButton";
import { HoldButton } from "@/components/shared/HoldButton";
import { useAdmin } from "@/hooks/useAdmin";
import { useGameState } from "@/hooks/useGameState";

export default function AdminPage() {
  const { gameState, isLoading, setGameState } = useGameState();
  const { drawCard, undoCard, setMode, newGame, clearBoard } = useAdmin(gameState, setGameState);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-zinc-400 text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky header: mode selector + code + undo */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-zinc-900 border-b border-zinc-800 px-3 py-2">
        <ModeSelector currentMode={gameState.mode} onModeChange={setMode} />
        <div className="flex items-center gap-3">
          {gameState.code && (
            <span className="font-mono font-black text-lg tracking-widest text-white">
              {String(gameState.code)}
            </span>
          )}
          <UndoButton
            disabled={gameState.drawn.length === 0}
            onUndo={undoCard}
          />
        </div>
      </header>

      {/* Search bar */}
      <div className="px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <input
          type="search"
          placeholder="Buscar carta..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        />
      </div>

      {/* Card count + session controls */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400">
        <span>
          Cartas cantadas:{" "}
          <span className="font-bold text-zinc-200">{gameState.drawn.length}</span>
          {" / 54"}
        </span>
        <div className="flex gap-2">
          <HoldButton
            label="⟳ Limpiar"
            onConfirm={clearBoard}
            disabled={gameState.drawn.length === 0}
            ariaLabel="Limpiar tablero (mantén presionado)"
            className={gameState.drawn.length === 0 ? "bg-zinc-800 text-zinc-600 cursor-not-allowed" : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"}
            holdClassName="bg-zinc-500 text-white"
            fillClassName="bg-zinc-400"
          />
          <button
            onClick={() => {
              if (confirm("¿Iniciar una nueva partida? Se perderá el progreso actual.")) {
                newGame();
              }
            }}
            className="rounded px-2 py-0.5 bg-zinc-700 text-zinc-300 hover:bg-zinc-600 transition-colors"
          >
            Nueva partida
          </button>
        </div>
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
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
}
