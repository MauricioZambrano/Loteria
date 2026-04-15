"use client";

import { useCallback, useEffect, useRef } from "react";
import { getSupabase, CHANNEL_NAME, TABLE_NAME } from "@/lib/supabase";
import { clearSessionId, getSavedSessionId, saveSessionId } from "@/hooks/useGameState";
import {
  GameState,
  GameMode,
  withCardDrawn,
  withCardUndone,
  withMode,
} from "@/lib/gameState";
import type { RealtimeChannel } from "@supabase/supabase-js";

// Lazily get or create the broadcast channel (shared across hook instances)
let broadcastChannel: RealtimeChannel | null = null;

function getChannel(): RealtimeChannel {
  if (!broadcastChannel) {
    broadcastChannel = getSupabase().channel(CHANNEL_NAME);
    broadcastChannel.subscribe();
  }
  return broadcastChannel;
}

function generateCode(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

async function persistAndBroadcast(next: GameState): Promise<void> {
  const db = getSupabase();
  // Write to Postgres (source of truth)
  if (next.sessionId) {
    await db
      .from(TABLE_NAME)
      .update({
        drawn: next.drawn,
        mode: next.mode,
        updated_at: next.updatedAt,
      })
      .eq("id", next.sessionId);
  } else {
    // First draw ever — create the session row with a join code
    const code = generateCode();
    const { data } = await db
      .from(TABLE_NAME)
      .insert({ drawn: next.drawn, mode: next.mode, code })
      .select("id, code")
      .single();

    if (data) {
      next = { ...next, sessionId: data.id, code: data.code };
    }
  }

  // Broadcast to all subscribers (fast path for Display)
  getChannel().send({
    type: "broadcast",
    event: "state_update",
    payload: next,
  });
}

interface UseAdminReturn {
  drawCard: (cardId: number) => void;
  undoCard: () => void;
  setMode: (mode: GameMode) => void;
  newGame: () => Promise<void>;
  clearBoard: () => void;
}

export function useAdmin(gameState: GameState, setGameState: (s: GameState) => void): UseAdminReturn {
  // Keep a ref so callbacks always see the latest state without re-creating
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

  // On mount: if there is no session yet, create one immediately so the
  // join code is visible before the first card is drawn.
  useEffect(() => {
    if (!getSavedSessionId()) {
      initSession();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initSession() {
    const db = getSupabase();
    const code = generateCode();
    const { data } = await db
      .from(TABLE_NAME)
      .insert({ drawn: [], mode: "libre", code })
      .select("id, code")
      .single();

    if (!data) return;
    saveSessionId(data.id);

    const freshState: GameState = {
      sessionId: data.id,
      code: data.code,
      drawn: [],
      mode: stateRef.current.mode,
      updatedAt: new Date().toISOString(),
    };

    // Update admin state directly — the broadcast may arrive before the
    // Realtime channel finishes subscribing, so we can't rely on it alone.
    setGameState(freshState);
    getChannel().send({
      type: "broadcast",
      event: "state_update",
      payload: freshState,
    });
  }

  const drawCard = useCallback((cardId: number) => {
    const next = withCardDrawn(stateRef.current, cardId);
    if (next === stateRef.current) return; // card already drawn, no-op
    persistAndBroadcast(next);
  }, []);

  const undoCard = useCallback(() => {
    const next = withCardUndone(stateRef.current);
    if (next === stateRef.current) return; // nothing to undo
    persistAndBroadcast(next);
  }, []);

  const setMode = useCallback((mode: GameMode) => {
    const next = withMode(stateRef.current, mode);
    persistAndBroadcast(next);
  }, []);

  const newGame = useCallback(async () => {
    clearSessionId();
    const db = getSupabase();
    const code = generateCode();
    const { data } = await db
      .from(TABLE_NAME)
      .insert({ drawn: [], mode: "libre", code })
      .select("id, code")
      .single();

    if (!data) return;
    saveSessionId(data.id);

    const freshState: GameState = {
      sessionId: data.id,
      code: data.code,
      drawn: [],
      mode: "libre",
      updatedAt: new Date().toISOString(),
    };

    getChannel().send({
      type: "broadcast",
      event: "state_update",
      payload: freshState,
    });
  }, []);

  const clearBoard = useCallback(() => {
    const next = { ...stateRef.current, drawn: [], updatedAt: new Date().toISOString() };
    setGameState(next);           // update admin immediately
    persistAndBroadcast(next);    // persist + push to display
  }, [setGameState]);

  return { drawCard, undoCard, setMode, newGame, clearBoard };
}
