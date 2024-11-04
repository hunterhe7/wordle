import { useState, useCallback } from "react";
import { CellStatus, PlayerGameState } from "../types/types";
import { GAME_CONFIG } from "../config/gameConfig";

export const useWordleGame = () => {
  const [gameState, setGameState] = useState<PlayerGameState>({
    currentRow: 0,
    guesses: [],
    evaluations: [],
    status: "waiting",
  });

  const [letterStatuses, setLetterStatuses] = useState<
    Record<string, CellStatus>
  >({});

  const updateKeyStatuses = useCallback(
    (evaluations: CellStatus[][], guesses: string[]) => {
      const newKeyStatuses: Record<string, CellStatus> = { ...letterStatuses };

      guesses.forEach((guess, guessIndex) => {
        const evaluation = evaluations[guessIndex];
        if (!evaluation) return;

        guess.split("").forEach((letter, letterIndex) => {
          const status = evaluation[letterIndex];
          const lowerLetter = letter.toLowerCase();

          // Only update if current status is better than existing
          if (
            !newKeyStatuses[lowerLetter] ||
            status === "correct" ||
            (status === "present" && newKeyStatuses[lowerLetter] === "absent")
          ) {
            newKeyStatuses[lowerLetter] = status;
          }
        });
      });

      setLetterStatuses(newKeyStatuses);
    },
    [letterStatuses]
  );

  const makeGuess = useCallback(
    (guess: string) => {
      if (
        guess.length !== GAME_CONFIG.WORD_LENGTH ||
        gameState.status !== "playing" ||
        gameState.currentRow >= GAME_CONFIG.MAX_GUESSES
      ) {
        return false;
      }

      setGameState((prev) => ({
        ...prev,
        guesses: [...prev.guesses, guess],
        currentRow: prev.currentRow + 1,
      }));

      return true;
    },
    [gameState]
  );

  const resetGame = useCallback(() => {
    setGameState({
      currentRow: 0,
      guesses: [],
      evaluations: [],
      status: "waiting",
    });
    setLetterStatuses({});
  }, []);

  return {
    gameState,
    letterStatuses,
    makeGuess,
    updateKeyStatuses,
    resetGame,
  };
};
