import { GAME_CONFIG } from "../config/gameConfig";
import { RoomState, Player, GameState, PlayerGameState } from "../types/types";
import { WordleGame } from "./wordleGame";

export class RoomManager {
  private static readonly MAX_PLAYERS = GAME_CONFIG.MAX_PLAYERS;
  private static readonly MAX_GUESSES = GAME_CONFIG.MAX_GUESSES;

  private rooms: Map<string, RoomState>;

  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId: string, host: Player): RoomState {
    const playerState: PlayerGameState = {
      currentRow: 0,
      guesses: [],
      evaluations: [],
      status: "waiting",
    };

    const roomState: RoomState = {
      id: roomId,
      players: [host],
      gameState: {
        status: "waiting",
        playerStates: {
          [host.id]: playerState,
        },
      },
    };

    this.rooms.set(roomId, roomState);
    return roomState;
  }

  addPlayerToRoom(roomId: string, player: Player): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    if (room.players.length >= RoomManager.MAX_PLAYERS) {
      return null;
    }

    room.players.push(player);
    room.gameState.playerStates[player.id] = {
      currentRow: 0,
      guesses: [],
      evaluations: [],
      status: "waiting",
    };

    return room;
  }

  removePlayerFromRoom(roomId: string, playerId: string): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) return null;

    const playerIndex = room.players.findIndex((p) => p.id === playerId);
    if (playerIndex === -1) return null;

    room.players.splice(playerIndex, 1);
    delete room.gameState.playerStates[playerId];

    if (room.players.length === 0) {
      this.rooms.delete(roomId);
      return null;
    }

    // If host leaves, set first player as new host
    if (playerIndex === 0 && room.players.length > 0) {
      room.players[0].isHost = true;
    }

    return room;
  }

  startGame(roomId: string): RoomState | null {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.log("[startGame] Room not found:", roomId);
      return null;
    }

    // Set room status to playing
    room.gameState.status = "playing";
    room.gameState.solution = WordleGame.getRandomWord();

    console.log(
      "[startGame] Starting game with solution:",
      room.gameState.solution
    );

    // Reset all player states
    room.players.forEach((player) => {
      player.gameState = {
        currentRow: 0,
        guesses: [],
        evaluations: [],
        status: "playing",
      };
      room.gameState.playerStates[player.id] = player.gameState;
    });

    console.log("[startGame] Room state after initialization:", {
      roomStatus: room.gameState.status,
      playerStates: Object.entries(room.gameState.playerStates).map(
        ([id, state]) => ({
          id,
          status: state.status,
        })
      ),
    });

    return room;
  }

  makeGuess(
    roomId: string,
    playerId: string,
    guess: string
  ): {
    success: boolean;
    message?: string;
    room?: RoomState;
    evaluation?: string;
  } {
    const room = this.rooms.get(roomId);
    if (!room) {
      console.log("[makeGuess] Room not found:", roomId);
      return { success: false, message: "Room not found" };
    }

    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      console.log("[makeGuess] Player not found:", playerId);
      return { success: false, message: "Player not found" };
    }

    if (guess.length !== GAME_CONFIG.WORD_LENGTH) {
      console.log("[makeGuess] Invalid guess length:", guess.length);
      return { success: false, message: "Invalid word length" };
    }

    console.log("[makeGuess] Current game state:", {
      roomStatus: room.gameState.status,
      playerStatus: player.gameState.status,
      playerId,
      guess,
    });

    // Check room status
    if (room.gameState.status !== "playing") {
      console.log("[makeGuess] Room is not in playing state");
      return { success: false, message: "Room is not in playing state" };
    }

    // Check player status
    if (player.gameState.status !== "playing") {
      console.log("[makeGuess] Player is not in playing state");
      return { success: false, message: "Game is not in playing state" };
    }

    // Validate guess
    if (!WordleGame.isValidWord(guess)) {
      return { success: false, message: "Invalid word" };
    }

    // Ensure solution exists
    if (!room.gameState.solution) {
      console.log("[makeGuess] No solution found for room");
      return { success: false, message: "Game configuration error" };
    }

    // Evaluate guess
    try {
      const evaluation = WordleGame.evaluateGuess(
        guess,
        room.gameState.solution
      );
      if (!evaluation || evaluation.length !== GAME_CONFIG.WORD_LENGTH) {
        console.log("[makeGuess] Invalid evaluation result:", evaluation);
        return { success: false, message: "Error processing guess" };
      }

      // Update player state
      player.gameState.guesses.push(guess);
      player.gameState.evaluations.push(evaluation);
      player.gameState.currentRow++;

      // Check for win
      if (guess.toUpperCase() === room.gameState.solution) {
        player.gameState.status = "won";
        
        // When a player wins, set all other players' status to "lost"
        room.players.forEach(p => {
          if (p.id !== playerId && p.gameState.status === "playing") {
            p.gameState.status = "lost";
            room.gameState.playerStates[p.id] = p.gameState;
          }
        });
      } else if (player.gameState.currentRow >= RoomManager.MAX_GUESSES) {
        player.gameState.status = "lost";
      } else {
        player.gameState.status = "playing";
      }

      // Update room state
      room.gameState.playerStates[playerId] = player.gameState;

      console.log("[makeGuess] Updated game state:", {
        roomStatus: room.gameState.status,
        playerStatus: player.gameState.status,
        evaluation,
      });

      return {
        success: true,
        room,
        evaluation: evaluation.join(""),
      };
    } catch (error) {
      console.error("[makeGuess] Error during guess evaluation:", error);
      return { success: false, message: "Error processing guess" };
    }
  }
}
