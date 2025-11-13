import type { Server } from 'socket.io';

let ioInstance: Server | null = null;

export function registerSocket(server: Server) {
  ioInstance = server;
}

export function getSocket(): Server | null {
  return ioInstance;
}
