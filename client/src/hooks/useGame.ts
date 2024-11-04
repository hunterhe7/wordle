import { Socket } from "socket.io-client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { GameState, GameStatus } from "../types/types";
import { GAME_CONFIG } from "../config/gameConfig";
import { useWordleGame } from "./useWordleGame";
import { GameSocket } from "../services/gameSocket";

const initialGameState: GameState = {
  roomId: null,
  isHost: false,
  players: [],
  currentGuess: "",
  gameOver: false,
  letterStatuses: {},
  status: "waiting",
  playerStates: {},
};

export const useGame = (socket: Socket) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const { updateKeyStatuses } = useWordleGame();
  const gameSocket = useMemo(() => new GameSocket(socket), [socket]);

  // Add letter
  const addLetter = useCallback(
    (letter: string) => {
      if (
        gameState.currentGuess.length < GAME_CONFIG.WORD_LENGTH &&
        !gameState.gameOver
      ) {
        setGameState((prev) => ({
          ...prev,
          currentGuess: prev.currentGuess + letter,
        }));
      }
    },
    [gameState]
  );

  // Remove letter
  const removeLetter = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      currentGuess: prev.currentGuess.slice(0, -1),
    }));
  }, []);

  // Submit guess
  const submitGuess = useCallback(async () => {
    if (
      gameState.currentGuess.length !== GAME_CONFIG.WORD_LENGTH ||
      gameState.gameOver
    )
      return;

    const response = await gameSocket.makeGuess(
      gameState.roomId!,
      gameState.currentGuess
    );

    if (response.success) {
      setGameState((prev) => ({
        ...prev,
        currentGuess: "",
      }));
    }
  }, [
    gameState.currentGuess,
    gameState.gameOver,
    gameState.roomId,
    gameSocket,
  ]);

  // Create room
  const createRoom = useCallback(async () => {
    const response = await gameSocket.createRoom();

    if (response.error) {
      console.error("Failed to create room:", response.error);
      return;
    }

    if (response.roomId && response.roomState) {
      setGameState((prev) => ({
        ...prev,
        roomId: response.roomId || null,
        isHost: response.isHost || false,
        players: response.roomState?.players || [],
        status: response.roomState.gameState.status,
        playerStates: response.roomState.gameState.playerStates,
        gameOver: false,
        currentGuess: "",
        letterStatuses: response.roomState.gameState.letterStatuses || {},
      }));
    }
  }, [gameSocket]);

  // Join room
  const joinRoom = useCallback(
    async (roomId: string) => {
      const response = await gameSocket.joinRoom(roomId);
      if (response.success && response.roomState) {
        setGameState((prev) => ({
          ...prev,
          roomId: roomId,
          isHost: response.isHost,
          players: response.roomState.players,
          status: response.roomState.gameState.status,
          playerStates: response.roomState.gameState.playerStates,
          letterStatuses: response.roomState.gameState.letterStatuses || {},
        }));
      }
    },
    [gameSocket]
  );

  // Start game
  const startGame = useCallback(() => {
    if (gameState.isHost && gameState.roomId) {
      console.log("Starting game for room:", gameState.roomId);
      gameSocket.startGame(gameState.roomId);
    } else {
      console.log("Cannot start game:", {
        isHost: gameState.isHost,
        roomId: gameState.roomId,
      });
    }
  }, [gameState.isHost, gameState.roomId, gameSocket]);

  // Socket event listeners
  useEffect(() => {
    gameSocket.onGameStateUpdate((data) => {
      if (data.roomState) {
        setGameState((prev) => ({
          ...prev,
          players: data.roomState.players,
          status: data.roomState.gameState.status,
          playerStates: data.roomState.gameState.playerStates,
          letterStatuses: data.roomState.gameState.letterStatuses || {},
        }));

        if (data.evaluation) {
          updateKeyStatuses([data.evaluation], [data.guess]);
        }
      }
    });

    gameSocket.onGameStarted((data) => {
      console.log("[gameStarted] Received gameStarted event:", data);
      if (data.roomState) {
        setGameState((prev) => {
          const newState = {
            ...prev,
            status: "playing" as GameStatus,
            players: data.roomState.players,
            playerStates: data.roomState.gameState.playerStates,
            letterStatuses: data.roomState.gameState.letterStatuses || {},
            gameOver: false,
          };

          console.log("[gameStarted] State update:", {
            oldStatus: prev.status,
            newStatus: newState.status,
            players: newState.players.map((p) => ({
              id: p.id,
              status: p.gameState.status,
            })),
          });

          return newState;
        });
      }
    });

    gameSocket.onRoomUpdate((roomState) => {
      if (roomState) {
        setGameState((prev) => ({
          ...prev,
          players: roomState.players,
          status: roomState.gameState.status,
          playerStates: roomState.gameState.playerStates,
        }));
      }
    });

    gameSocket.onError((data) => {
      console.error("Socket error:", data.message);
    });

    return () => {
      gameSocket.cleanup();
    };
  }, [gameSocket, updateKeyStatuses]);

  return {
    gameState,
    addLetter,
    removeLetter,
    submitGuess,
    createRoom,
    joinRoom,
    startGame,
  };
};
