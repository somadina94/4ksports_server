import type { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
export declare const initSocket: (server: HttpServer) => SocketIOServer;
export declare const getIo: () => SocketIOServer | null;
export declare const emitSocketEvent: (event: string, payload: unknown) => void;
//# sourceMappingURL=io.d.ts.map