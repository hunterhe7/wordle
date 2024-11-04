import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupGameHandlers } from "./socket/gameHandlers";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  setupGameHandlers(io, socket);
});

const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
