"use client";

import { FormEvent, useEffect, useState } from "react";
import { CurrentCard } from "@/components/display/CurrentCard";
import { DrawnHistory } from "@/components/display/DrawnHistory";
import { ModeBanner } from "@/components/display/ModeBanner";
import { useGameState } from "@/hooks/useGameState";
import { getLastDrawn } from "@/lib/gameState";
import { CARD_BY_ID } from "@/lib/cards";
import { getSupabase, TABLE_NAME } from "@/lib/supabase";

const DISPLAY_SESSION_KEY = "loteria_display_session_id";

function getSavedDisplaySession(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(DISPLAY_SESSION_KEY);
}

export default function DisplayPage() {
  const [displaySessionId, setDisplaySessionId] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [codeInput, setCodeInput] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Read localStorage only after hydration to avoid server/client mismatch
  useEffect(() => {
    setDisplaySessionId(getSavedDisplaySession());
    setIsInitializing(false);
  }, []);

  // Pass null while awaiting code so the hook skips fetching
  const { gameState, isLoading } = useGameState(displaySessionId ?? null);

  async function handleCodeSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = codeInput.trim();
    if (!/^\d{6}$/.test(trimmed)) {
      setCodeError("El código debe tener exactamente 6 dígitos");
      return;
    }

    setIsSubmitting(true);
    setCodeError("");

    const { data, error } = await getSupabase()
      .from(TABLE_NAME)
      .select("id")
      .eq("code", parseInt(trimmed, 10))
      .single();

    if (error || !data) {
      setCodeError("Código no encontrado. Verifica el número en el panel del admin.");
      setIsSubmitting(false);
      return;
    }

    localStorage.setItem(DISPLAY_SESSION_KEY, data.id);
    setDisplaySessionId(data.id);
  }

  function handleExit() {
    localStorage.removeItem(DISPLAY_SESSION_KEY);
    setDisplaySessionId(null);
    setCodeInput("");
    setCodeError("");
  }


  if (isInitializing) {
    return <div className="flex h-screen items-center justify-center bg-zinc-950" />;
  }

  // Code entry screen
  if (!displaySessionId) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 gap-8 px-6">
        <div className="text-center">
          <h1 className="text-4xl font-black text-white mb-2">Lotería</h1>
          <p className="text-zinc-400 text-lg">Ingresa el código que aparece en el panel del admin</p>
        </div>

        <form onSubmit={handleCodeSubmit} className="flex flex-col items-center gap-4 w-full max-w-xs">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.replace(/\D/g, ""))}
            className="w-full text-center text-4xl font-mono font-black tracking-widest rounded-xl border-2 border-zinc-700 bg-zinc-900 text-white px-4 py-4 focus:outline-none focus:border-yellow-400"
            autoFocus
          />
          {codeError && (
            <p className="text-red-400 text-sm text-center">{codeError}</p>
          )}
          <button
            type="submit"
            disabled={isSubmitting || codeInput.length !== 6}
            className="w-full rounded-xl bg-yellow-400 text-zinc-900 font-black text-xl py-3 disabled:opacity-40 hover:bg-yellow-300 transition-colors"
          >
            {isSubmitting ? "Buscando..." : "Conectar"}
          </button>
        </form>
      </div>
    );
  }

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
        <div className="flex items-center justify-between">
          <button
            onClick={handleExit}
            className="rounded px-2 py-0.5 text-xs bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-zinc-200 transition-colors"
          >
            Salir
          </button>
          <p className="text-xs text-zinc-500">
            Cartas cantadas:{" "}
            <span className="text-zinc-300 font-bold">{gameState.drawn.length}</span>
            {" / 54"}
          </p>
        </div>
      </footer>
    </div>
  );
}
