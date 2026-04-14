export type GameMode =
  | "libre"           // Free play — no specific win condition
  | "fila"            // Any row
  | "columna"         // Any column
  | "diagonal"        // Any diagonal
  | "esquinas"        // 4 corners
  | "loteria";        // Full blackout

export const GAME_MODE_LABELS: Record<GameMode, string> = {
  libre:    "Libre",
  fila:     "Fila",
  columna:  "Columna",
  diagonal: "Diagonal",
  esquinas: "Esquinas",
  loteria:  "Lotería Completa",
};

export const GAME_MODE_COLORS: Record<GameMode, string> = {
  libre:    "bg-zinc-700",
  fila:     "bg-blue-700",
  columna:  "bg-purple-700",
  diagonal: "bg-orange-700",
  esquinas: "bg-green-700",
  loteria:  "bg-red-700",
};

export interface GameState {
  sessionId: string;
  drawn: number[];    // Card IDs in draw order
  mode: GameMode;
  updatedAt: string;
}

export const EMPTY_GAME_STATE: GameState = {
  sessionId: "",
  drawn: [],
  mode: "libre",
  updatedAt: new Date().toISOString(),
};

export function getLastDrawn(state: GameState): number | null {
  return state.drawn.length > 0 ? state.drawn[state.drawn.length - 1] : null;
}

export function isDrawn(state: GameState, cardId: number): boolean {
  return state.drawn.includes(cardId);
}

export function withCardDrawn(state: GameState, cardId: number): GameState {
  if (isDrawn(state, cardId)) return state;
  return {
    ...state,
    drawn: [...state.drawn, cardId],
    updatedAt: new Date().toISOString(),
  };
}

export function withCardUndone(state: GameState): GameState {
  if (state.drawn.length === 0) return state;
  return {
    ...state,
    drawn: state.drawn.slice(0, -1),
    updatedAt: new Date().toISOString(),
  };
}

export function withMode(state: GameState, mode: GameMode): GameState {
  return { ...state, mode, updatedAt: new Date().toISOString() };
}
