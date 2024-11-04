import { CellStatus } from '../types/types';
import { WordListUtils } from '../config/wordList';
import { GAME_CONFIG } from '../config/gameConfig';

export class WordleGame {
  static isValidWord(word: string): boolean {
    return WordListUtils.isValidWord(word);
  }

  static getRandomWord(): string {
    return WordListUtils.getRandomWord();
  }

  static evaluateGuess(guess: string, solution: string): CellStatus[] {
    // Validate input
    if (!guess || !solution || guess.length !== GAME_CONFIG.WORD_LENGTH || solution.length !== GAME_CONFIG.WORD_LENGTH) {
      console.error("[evaluateGuess] Invalid input:", { guess, solution });
      throw new Error("Invalid input for guess evaluation");
    }

    const evaluation: CellStatus[] = new Array(GAME_CONFIG.WORD_LENGTH).fill('absent');
    const solutionChars = solution.toUpperCase().split('');
    const guessChars = guess.toUpperCase().split('');

    // First pass: mark correct positions
    for (let i = 0; i < GAME_CONFIG.WORD_LENGTH; i++) {
      if (guessChars[i] === solutionChars[i]) {
        evaluation[i] = 'correct';
        solutionChars[i] = '*';
        guessChars[i] = '*';
      }
    }

    // Second pass: mark present letters
    for (let i = 0; i < GAME_CONFIG.WORD_LENGTH; i++) {
      if (guessChars[i] !== '*') {
        const index = solutionChars.indexOf(guessChars[i]);
        if (index !== -1) {
          evaluation[i] = 'present';
          solutionChars[index] = '*';
        }
      }
    }

    // Validate output
    if (evaluation.length !== GAME_CONFIG.WORD_LENGTH) {
      console.error("[evaluateGuess] Invalid evaluation length:", evaluation);
      throw new Error("Invalid evaluation result");
    }

    return evaluation;
  }
} 