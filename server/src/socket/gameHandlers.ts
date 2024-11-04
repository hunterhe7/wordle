import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { RoomManager } from "../services/roomManager";
import { Player } from "../types/types";
import { GAME_CONFIG } from "../config/gameConfig";

const roomManager = new RoomManager();

export function setupGameHandlers(io: Server, socket: Socket) {
  // Create room
  socket.on("createRoom", (_, callback) => {
    try {
      const roomId = uuidv4()
        .slice(0, GAME_CONFIG.ROOM_ID_LENGTH)
        .toUpperCase();
      const player: Player = {
        id: socket.id,
        name: `Player ${Math.floor(Math.random() * 1000)}`,
        isHost: true,
        score: 0,
        gameState: {
          currentRow: 0,
          guesses: [],
          evaluations: [],
          status: "waiting",
        },
      };

      const room = roomManager.createRoom(roomId, player);
      socket.join(roomId);

      callback({
        success: true,
        roomId,
        isHost: true,
        roomState: room,
      });

      io.to(roomId).emit("roomUpdate", room);
    } catch (error) {
      console.error("Error creating room:", error);
      callback({ success: false, error: "Failed to create room" });
    }
  });

  // Join room
  socket.on("joinRoom", ({ roomId }, callback) => {
    try {
      const player: Player = {
        id: socket.id,
        name: `Player ${Math.floor(Math.random() * 1000)}`,
        isHost: false,
        score: 0,
        gameState: {
          currentRow: 0,
          guesses: [],
          evaluations: [],
          status: "waiting",
        },
      };

      const room = roomManager.addPlayerToRoom(roomId, player);
      if (!room) {
        callback({ success: false, error: "Room not found or full" });
        return;
      }

      socket.join(roomId);
      callback({ success: true, roomState: room });
      io.to(roomId).emit("roomUpdate", room);
    } catch (error) {
      callback({ success: false, error: "Failed to join room" });
    }
  });

  // Start game
  socket.on("startGame", ({ roomId }) => {
    try {
      const room = roomManager.startGame(roomId);
      console.log("[startGame] Room state after startGame:", room);

      if (room) {
        console.log("[startGame] Emitting gameStarted event to room:", roomId);
        io.to(roomId).emit("gameStarted", { roomState: room });
        console.log("[startGame] gameStarted event emitted");
      } else {
        console.error("[startGame] Room is null after startGame");
      }
    } catch (error) {
      console.error("[startGame] Error:", error);
      socket.emit("error", { message: "Failed to start game" });
    }
  });

  // Submit guess
  socket.on("makeGuess", ({ roomId, guess }, callback) => {
    try {
      const result = roomManager.makeGuess(roomId, socket.id, guess);
      if (!result.success) {
        callback({ success: false, message: result.message });
        socket.emit("error", { message: result.message });
        return;
      }

      callback({
        success: true,
        evaluation: result.evaluation,
      });

      if (result.room) {
        io.to(roomId).emit("gameStateUpdate", {
          roomState: result.room,
          playerId: socket.id,
          guess,
          evaluation: result.evaluation,
        });
      }
    } catch (error) {
      callback({ success: false, message: "Failed to process guess" });
      socket.emit("error", { message: "Failed to process guess" });
    }
  });

  // Disconnect
  socket.on("disconnect", () => {
    const rooms = Array.from(socket.rooms);
    rooms.forEach((roomId) => {
      if (roomId !== socket.id) {
        const room = roomManager.removePlayerFromRoom(roomId, socket.id);
        if (room) {
          io.to(roomId).emit("roomUpdate", room);
        }
      }
    });
  });
}
