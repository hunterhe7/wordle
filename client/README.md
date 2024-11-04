# Multiplayer Wordle Client

The frontend React application for the multiplayer Wordle game.

## Setup

1. Install dependencies
   ```
   npm install
   ```

2. Configure environment variables
   Create a `.env` file with:
   ```
   REACT_APP_SOCKET_URL=http://localhost:3001 # The URL of the server
   ```

3. Start development server
   ```
   npm start
   ```

The client will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/          # React components
│   ├── GameBoard.tsx   # Game board display
│   ├── GameContainer.tsx # Main game wrapper
│   ├── Keyboard.tsx    # Virtual keyboard
│   ├── RoomControls.tsx # Room management UI
│   └── RoomInfo.tsx    # Room status display
│
├── hooks/              # Custom React hooks
│   ├── useGame.ts      # Game state management
│   └── useKeyboard.ts  # Keyboard input handling
│
├── services/           # External services
│   ├── socket.ts       # Socket.io setup
│   └── gameSocket.ts   # Game-specific socket events
│
├── styles/            # CSS Modules
│   ├── GameContainer.module.css
│   ├── Keyboard.module.css
│   ├── RoomControls.module.css
│   ├── RoomInfo.module.css
│   └── global.css
│
├── types/             # TypeScript definitions
│   ├── css.d.ts       # CSS module types
│   └── types.ts       # Game-related types
│
└── config/            # Configuration
    └── gameConfig.ts  # Game settings
```
