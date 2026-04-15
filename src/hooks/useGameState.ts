"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase, CHANNEL_NAME, TABLE_NAME } from "@/lib/supabase";
import {
  GameState,
  EMPTY_GAME_STATE,
} from "@/lib/gameState";
import type { RealtimeChannel } from "@supabase/supabase-js";

const SESSION_STORAGE_KEY = "loteria_session_id";

export function getSavedSessionId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_STORAGE_KEY);
}

export function saveSessionId(id: string): void {
  localStorage.setItem(SESSION_STORAGE_KEY, id);
}

export function clearSessionId(): void {
  localStorage.removeItem(SESSION_STORAGE_KEY);
}

interface UseGameStateReturn {
  gameState: GameState;
  isLoading: boolean;
  setGameState: (state: GameState) => void;
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>(EMPTY_GAME_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  async function fetchAndSync() {
    const savedId = getSavedSessionId();
    let query = getSupabase().from(TABLE_NAME).select("*");

    // If we have a saved session ID, fetch that specific session
    if (savedId) {
      query = query.eq("id", savedId);
    } else {
      query = query.order("updated_at", { ascending: false });
    }

    const { data, error } = await query.limit(1).single();

    if (error || !data) {
      // No session yet — keep empty state, admin will create one on first draw
      setIsLoading(false);
      return;
    }

    saveSessionId(data.id);
    setGameState({
      sessionId: data.id,
      drawn: data.drawn ?? [],
      mode: data.mode ?? "libre",
      updatedAt: data.updated_at,
    });
    setIsLoading(false);
  }

  function subscribe() {
    const channel = getSupabase().channel(CHANNEL_NAME, {
      config: { broadcast: { self: true } },
    });

    channel.on("broadcast", { event: "state_update" }, ({ payload }) => {
      const state = payload as GameState;
      if (state.sessionId) saveSessionId(state.sessionId);
      setGameState(state);
    });

    channel.subscribe((status) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        // Re-fetch from Postgres as fallback on channel error
        fetchAndSync();
      }
    });

    channelRef.current = channel;
  }

  useEffect(() => {
    fetchAndSync().then(() => subscribe());

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        // Re-sync when tab becomes visible again (e.g., laptop wakes from sleep)
        fetchAndSync();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (channelRef.current) {
        getSupabase().removeChannel(channelRef.current);
      }
    };
  }, []);

  return { gameState, isLoading, setGameState };
}
