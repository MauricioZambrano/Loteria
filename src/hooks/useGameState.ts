"use client";

import { useEffect, useRef, useState } from "react";
import { getSupabase, CHANNEL_NAME, TABLE_NAME } from "@/lib/supabase";
import {
  GameState,
  EMPTY_GAME_STATE,
} from "@/lib/gameState";
import type { RealtimeChannel } from "@supabase/supabase-js";

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
    const { data, error } = await getSupabase()
      .from(TABLE_NAME)
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      // No session yet — keep empty state, admin will create one on first draw
      setIsLoading(false);
      return;
    }

    setGameState({
      sessionId: data.id,
      drawn: data.drawn ?? [],
      mode: data.mode ?? "libre",
      updatedAt: data.updated_at,
    });
    setIsLoading(false);
  }

  function subscribe() {
    const channel = getSupabase().channel(CHANNEL_NAME);

    channel.on("broadcast", { event: "state_update" }, ({ payload }) => {
      setGameState(payload as GameState);
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
