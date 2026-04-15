"use client";

import { useCallback, useRef } from "react";
import { getSupabase, getChannelName, TABLE_NAME } from "@/lib/supabase";
import {
  GameState,
  GameMode,
  withCardDrawn,
  withCardUndone,
  withMode,
} from "@/lib/gameState";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Module-level cache: one write channel per sessionId
const broadcastChannels = new Map<string, RealtimeChannel>();

function getChannel(sessionId: string): RealtimeChannel {
  if (!broadcastChannels.has(sessionId)) {
    const ch = getSupabase().channel(getChannelName(sessionId));
    ch.subscribe();
    broadcastChannels.set(sessionId, ch);
  }
  return broadcastChannels.get(sessionId)!;
}

function generateCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

async function persistAndBroadcast(next: GameState): Promise<void> {
  if (!next.sessionId) return;

  const db = getSupabase();
  await db
    .from(TABLE_NAME)
    .update({
      drawn: next.drawn,
      mode: next.mode,
      updated_at: next.updatedAt,
    })
    .eq("id", next.sessionId);

  getChannel(next.sessionId).send({
    type: "broadcast",
    event: "state_update",
    payload: next,
  });
}

interface UseAdminReturn {
  drawCard: (cardId: number) => void;
  undoCard: () => void;
  setMode: (mode: GameMode) => void;
  /** Creates a new session and returns its UUID. The caller is responsible for
   *  navigating to the new URL (window.history.pushState). */
  newGame: () => Promise<string | null>;
  clearBoard: () => void;
}

export function useAdmin(gameState: GameState, setGameState: (s: GameState) => void): UseAdminReturn {
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  const drawCard = useCallback((cardId: number) => {
    const next = withCardDrawn(stateRef.current, cardId);
    if (next === stateRef.current) return;
    persistAndBroadcast(next);
  }, []);

  const undoCard = useCallback(() => {
    const next = withCardUndone(stateRef.current);
    if (next === stateRef.current) return;
    persistAndBroadcast(next);
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    const next = withMode(stateRef.current, mode);
    persistAndBroadcast(next);
  }, []);

  // Creates a brand-new session in the DB and returns the new UUID.
  // The admin page pushes the UUID into the URL, which triggers useGameState
  // to fetch and subscribe to the new session.
  const newGame = useCallback(async (): Promise<string | null> => {
    const db = getSupabase();
    const code = generateCode();
    const { data } = await db
      .from(TABLE_NAME)
      .insert({ drawn: [], mode: "libre", code })
      .select("id")
      .single();
    return data?.id ?? null;
  }, []);

  const clearBoard = useCallback(() => {
    const next = { ...stateRef.current, drawn: [], updatedAt: new Date().toISOString() };
    setGameState(next);
    persistAndBroadcast(next);
  }, [setGameState]);

  return { drawCard, undoCard, setMode, newGame, clearBoard };
}
