export type CellStatus = 'absent' | 'present' | 'correct';
export type GameStatus = "waiting" | "playing" | "won" | "lost";

export interface PlayerGameState {
  currentRow: number;
  guesses: string[];
  evaluations: CellStatus[][];
  status: GameStatus;
}

export interface Player {
  id: string;
  name: string;
  isHost: boolean;
  score: number;
  gameState: PlayerGameState;
}

export interface LetterStatus {
  [key: string]: CellStatus;
}

export interface GameState {
  roomId: string | null;
  isHost: boolean;
  players: Player[];
  currentGuess: string;
  gameOver: boolean;
  letterStatuses: LetterStatus;
  status: GameStatus;
  solution?: string;
  playerStates: Record<string, PlayerGameState>;
}

export interface RoomState {
  id: string;
  players: Player[];
  gameState: {
    status: GameStatus;
    solution?: string;
    playerStates: Record<string, PlayerGameState>;
    letterStatuses?: LetterStatus;
  };
}

export interface CreateRoomResponse {
  success?: boolean;
  roomId: string;
  isHost: boolean;
  roomState: RoomState;
  error?: string;
}

export interface JoinRoomResponse {
  success: boolean;
  error?: string;
  isHost: boolean;
  roomState: RoomState;
}

export interface GameStateUpdateResponse {
  roomState: RoomState;
}

export interface GameStartResponse {
  roomState: RoomState;
}

export interface RoomInfoProps {
  roomId: string;
  players: Player[];
  isHost: boolean;
}

export interface KeyboardProps {
  onKey: (key: string) => void;
  letterStatuses: Record<string, CellStatus>;
  disabled?: boolean;
}

export interface RoomControlsProps {
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

export interface GameBoardProps {
  guesses: string[];
  evaluations: CellStatus[][];
  currentGuess: string;
  currentRow: number;
}

export interface GameRowProps {
  word: string;
  evaluation: CellStatus[] | null;
  submitted: boolean;
}

export interface GameContainerProps {
  players: Player[];
  currentPlayerId: string;
  currentGuess: string;
  onKeyPress: (key: string) => void;
  roomId: string;
  isHost: boolean;
  onStartGame: () => void;
  letterStatuses: Record<string, CellStatus>;
}
