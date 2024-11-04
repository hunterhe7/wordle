# Multiplayer Wordle

A real-time multiplayer version of the popular word-guessing game Wordle, built with React, TypeScript, Socket.IO, and Node.js.

## Demo
![Demo](./image.png)

## Features

### Multiplayer Features

1. **Room-based System**
   - Players can create or join rooms using room codes
   - Maximum 2 players per room for optimal gameplay experience
   - Host player has control over starting the game

2. **Shared Word**
   - All players in a room guess the same word
   - Promotes fair competition and allows players to compare progress

3. **Core Wordle Gameplay**
   - 5-letter word guessing with classic Wordle rules
   - Visual feedback for letter statuses (correct, present, absent)
   - On-screen keyboard with color-coded feedback
   - 6 attempts maximum per game

4. **Win/Lose Conditions**
   - Players can win individually by guessing the word correctly
   - Game continues until all players either win or run out of attempts





## Run the project

```
git clone https://github.com/hunterhe7/wordle.git
cd server
npm install
npm run start

cd client
npm install
npm start
```
