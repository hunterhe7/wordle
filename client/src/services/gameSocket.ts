import { Socket } from "socket.io-client";
import {
  CreateRoomResponse,
  JoinRoomResponse,
  RoomState,
  CellStatus,
} from "../types/types";

export class GameSocket {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  // Room Management
  createRoom(): Promise<CreateRoomResponse> {
    return new Promise((resolve) => {
      this.socket.emit("createRoom", {}, (response: CreateRoomResponse) => {
        resolve(response);
      });
    });
  }

  joinRoom(roomId: string): Promise<JoinRoomResponse> {
    return new Promise((resolve) => {
      this.socket.emit("joinRoom", { roomId }, (response: JoinRoomResponse) => {
        resolve(response);
      });
    });
  }

  startGame(roomId: string): void {
    this.socket.emit("startGame", { roomId });
  }

  makeGuess(
    roomId: string,
    guess: string
  ): Promise<{ success: boolean; message?: string }> {
    return new Promise((resolve) => {
      this.socket.emit(
        "makeGuess",
        { roomId, guess },
        (response: { success: boolean; message?: string }) => {
          resolve(response);
        }
      );
    });
  }

  // Event Listeners
  onGameStateUpdate(
    callback: (data: {
      roomState: RoomState;
      playerId: string;
      guess: string;
      evaluation: CellStatus[];
    }) => void
  ): void {
    this.socket.on("gameStateUpdate", callback);
  }

  onGameStarted(callback: (data: { roomState: RoomState }) => void): void {
    this.socket.on("gameStarted", callback);
  }

  onRoomUpdate(callback: (roomState: RoomState) => void): void {
    this.socket.on("roomUpdate", callback);
  }

  onError(callback: (data: { message: string }) => void): void {
    this.socket.on("error", callback);
  }

  // Cleanup
  cleanup(): void {
    this.socket.off("gameStateUpdate");
    this.socket.off("gameStarted");
    this.socket.off("roomUpdate");
    this.socket.off("error");
  }
}
