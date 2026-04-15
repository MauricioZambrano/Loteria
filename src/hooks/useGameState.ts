"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase, getChannelName, TABLE_NAME } from "@/lib/supabase";
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
//   undefined  → admin mode: use localStorage session (or wait for useAdmin to create one)
//   null       → display waiting for code: skip fetch, stay loading=false
//   string     → display with known session: fetch that session, subscribe to its channel
export function useGameState(targetSessionId?: string | null): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>(EMPTY_GAME_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const channelRef = useRef<RealtimeChannel | null>(null);
  // Track which sessionId we're currently subscribed to to avoid double-subscribing
  const subscribedToRef = useRef<string | null>(null);

  async function fetchAndSync() {
    if (targetSessionId === null) {
      setIsLoading(false);
      return;
    }

    const sessionId = targetSessionId ?? getSavedSessionId();
    let query = getSupabase().from(TABLE_NAME).select("*");

    if (sessionId) {
      query = query.eq("id", sessionId);
    } else {
      // Admin: no saved ID yet — wait for useAdmin.initSession to create one
      setIsLoading(false);
      return;
    }

    const { data } = await query.limit(1).maybeSingle();

    if (!data) {
      if (targetSessionId === undefined && getSavedSessionId()) clearSessionId();
      setIsLoading(false);
      return;
    }

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

  function subscribeToSession(sessionId: string) {
    if (subscribedToRef.current === sessionId) return;

    // Tear down any existing subscription before switching sessions
    if (channelRef.current) {
      getSupabase().removeChannel(channelRef.current);
      channelRef.current = null;
    }

    subscribedToRef.current = sessionId;

    const channel = getSupabase().channel(getChannelName(sessionId), {
      config: { broadcast: { self: true } },
    });

    channel.on("broadcast", { event: "state_update" }, ({ payload }) => {
      const state = payload as GameState;
      // Keep admin localStorage in sync with the active session
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

  // Fetch on mount and whenever the display's target session changes
  useEffect(() => {
    fetchAndSync();

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
        subscribedToRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetSessionId]);

  // Subscribe to the session-scoped channel as soon as we know the sessionId.
  // This handles both the normal fetch path AND the admin bootstrap path where
  // useAdmin.initSession calls setGameState directly (before any fetch result).
  useEffect(() => {
    if (!gameState.sessionId) return;
    subscribeToSession(gameState.sessionId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.sessionId]);

  return { gameState, isLoading, setGameState };
}
