export const GAME_CONFIG = {
  WORD_LENGTH: 5, // Length of word
  MAX_GUESSES: 6, // Maximum guesses per player
  MAX_PLAYERS: 2, // Maximum players per room
  MIN_PLAYERS: 1, // Minimum players to start game
  ROOM_ID_LENGTH: 6, // Length of generated room IDs
} as const;
