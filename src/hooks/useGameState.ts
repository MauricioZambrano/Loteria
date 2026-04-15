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

// targetSessionId controls fetch/subscribe behaviour:
//   undefined  → admin mode: use localStorage session (or fetch latest)
//   null       → display waiting for code: skip fetch, stay loading=false
//   string     → display with known session: fetch that session, filter broadcasts
export function useGameState(targetSessionId?: string | null): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>(EMPTY_GAME_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);

  async function fetchAndSync() {
    // Display is waiting for the user to enter the code — nothing to fetch yet
    if (targetSessionId === null) {
      setIsLoading(false);
      return;
    }

    const sessionId = targetSessionId ?? getSavedSessionId();
    let query = getSupabase().from(TABLE_NAME).select("*");

    if (sessionId) {
      query = query.eq("id", sessionId);
    } else {
      // Admin: no saved ID yet — fall back to most recent session
      query = query.order("updated_at", { ascending: false });
    }

    const { data } = await query.limit(1).maybeSingle();

    if (!data) {
      // If we had a stale saved ID that no longer exists, clear it so a
      // fresh session can be created by useAdmin on the next render.
      if (targetSessionId === undefined && getSavedSessionId()) clearSessionId();
      setIsLoading(false);
      return;
    }

    // Only persist to admin localStorage when not using an explicit targetSessionId
    if (targetSessionId === undefined) saveSessionId(data.id);

    setGameState({
      sessionId: data.id,
      code: data.code ?? undefined,
      drawn: data.drawn ?? [],
      mode: data.mode ?? "libre",
      updatedAt: data.updated_at,
    });
    setIsLoading(false);
  }

  function subscribe() {
    if (targetSessionId === null) return;

    const channel = getSupabase().channel(CHANNEL_NAME, {
      config: { broadcast: { self: true } },
    });

    channel.on("broadcast", { event: "state_update" }, ({ payload }) => {
      const state = payload as GameState;

      // Display: ignore broadcasts meant for other sessions
      if (typeof targetSessionId === "string" && state.sessionId !== targetSessionId) return;

      // Admin: keep localStorage up to date with the current session
      if (targetSessionId === undefined && state.sessionId) saveSessionId(state.sessionId);

      setGameState(state);
    });

    channel.subscribe((status) => {
      if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        fetchAndSync();
      }
    });

    channelRef.current = channel;
  }

  useEffect(() => {
    fetchAndSync().then(() => subscribe());

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && targetSessionId !== null) {
        fetchAndSync();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (channelRef.current) {
        getSupabase().removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  // Re-run when targetSessionId changes (display enters the code)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSessionId]);

  return { gameState, isLoading, setGameState };
}
