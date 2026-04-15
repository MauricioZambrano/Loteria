"use client";

import { useState } from "react";
import { CardGrid } from "@/components/admin/CardGrid";
import { ModeSelector } from "@/components/admin/ModeSelector";
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

  const hasDrawn = gameState.drawn.length > 0;

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky header: mode selector + code */}
      <header className="sticky top-0 z-10 flex items-center justify-between gap-2 bg-zinc-900 border-b border-zinc-800 px-3 py-2">
        <ModeSelector currentMode={gameState.mode} onModeChange={setMode} />
        {gameState.code && (
          <div className="flex flex-col items-end leading-tight">
            <span className="text-[9px] uppercase tracking-widest text-zinc-500">Código pantalla</span>
            <span className="font-mono font-black text-lg tracking-widest text-white">
              {String(gameState.code)}
            </span>
          </div>
        )}
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

      {/* Card count + controls */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs text-zinc-400">
        <span>
          Cartas cantadas:{" "}
          <span className="font-bold text-zinc-200">{gameState.drawn.length}</span>
          {" / 54"}
        </span>
        <div className="flex gap-2">
          <HoldButton
            label="↩ Deshacer"
            onConfirm={undoCard}
            disabled={!hasDrawn}
            ariaLabel="Deshacer última carta (mantén presionado)"
            className={hasDrawn ? "bg-amber-700 text-amber-100 hover:bg-amber-600" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"}
            holdClassName="bg-amber-500 text-white"
            fillClassName="bg-amber-300"
          />
          <HoldButton
            label="⟳ Limpiar"
            onConfirm={clearBoard}
            disabled={!hasDrawn}
            ariaLabel="Limpiar tablero (mantén presionado)"
            className={hasDrawn ? "bg-blue-700 text-blue-100 hover:bg-blue-600" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"}
            holdClassName="bg-blue-500 text-white"
            fillClassName="bg-blue-300"
          />
          <button
            onClick={() => {
              if (confirm("¿Iniciar una nueva partida? Se perderá el progreso actual.")) {
                newGame();
              }
            }}
            className="rounded-lg px-3 py-1.5 text-xs font-bold bg-green-700 text-green-100 hover:bg-green-600 transition-colors"
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
