// Game word list configuration
export const WORD_LIST = [
  "WORLD",
  "HELLO",
  "APPLE",
  "HOUSE",
  "MUSIC",
  "TABLE",
  "CHAIR",
  "REACT",
  "REDUX",
];

// Word list utility functions
export const WordListUtils = {
  // Get a random word
  getRandomWord(): string {
    return WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
  },

  // Validate if a word is valid
  isValidWord(word: string): boolean {
    return WORD_LIST.includes(word.toUpperCase());
  },
};
