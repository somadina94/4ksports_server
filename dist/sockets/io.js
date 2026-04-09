import { Server as SocketIOServer } from "socket.io";
let io = null;
export const initSocket = (server) => {
    io = new SocketIOServer(server, {
        cors: { origin: "*" },
    });
    return io;
};
export const getIo = () => io;
export const emitSocketEvent = (event, payload) => {
    if (!io)
        return;
    io.emit(event, payload);
};
//# sourceMappingURL=io.js.map