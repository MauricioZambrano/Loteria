"use client";

import { useCallback, useRef } from "react";
import { getSupabase, CHANNEL_NAME, TABLE_NAME } from "@/lib/supabase";
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
    // First draw ever — create the session row
    const { data } = await db
      .from(TABLE_NAME)
      .insert({ drawn: next.drawn, mode: next.mode })
      .select("id")
      .single();

    if (data) {
      next = { ...next, sessionId: data.id };
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
}

export function useAdmin(gameState: GameState): UseAdminReturn {
  // Keep a ref so callbacks always see the latest state without re-creating
  const stateRef = useRef(gameState);
  stateRef.current = gameState;

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

  return { drawCard, undoCard, setMode };
}
