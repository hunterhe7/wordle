# Multiplayer Wordle Server

The backend server for the multiplayer Wordle game, built with Node.js, Express, and Socket.IO.

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Configure environment variables
   Create a `.env` file with:
   ```
   PORT=3001
   CLIENT_URL=http://localhost:3000
   ```

3. Start development server
   ```bash
   npm run start
   ```

## Project Structure
```
src/
├── config/              # Configuration files
│   ├── gameConfig.ts    # Game settings and constants
│   └── wordList.ts      # Valid words dictionary
│
├── services/           # Core services
│   ├── roomManager.ts  # Room management logic
│   └── wordService.ts  # Word validation and evaluation
│
├── socket/            # Socket.IO event handlers
│   └── gameHandlers.ts # Game-related socket events
│
├── types/             # TypeScript type definitions
│   └── types.ts       # Game and room types
│
└── index.ts          # Server entry point
