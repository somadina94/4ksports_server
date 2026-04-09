import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: { origin: "*" },
  });
  return io;
};

export const getIo = (): SocketIOServer | null => io;

export const emitSocketEvent = (event: string, payload: unknown): void => {
  if (!io) return;
  io.emit(event, payload);
};
