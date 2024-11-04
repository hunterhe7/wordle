export type GameStatus = "waiting" | "playing" | "won" | "lost";
export type CellStatus = "correct" | "present" | "absent" | "empty";

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  gameState: PlayerGameState;
}

export interface PlayerGameState {
  currentRow: number;
  guesses: string[];
  evaluations: CellStatus[][];
  status: GameStatus;
}

export interface GameState {
  status: GameStatus;
  solution?: string;
  playerStates: Record<string, PlayerGameState>;
}

export interface RoomState {
  id: string;
  players: Player[];
  gameState: GameState;
}
