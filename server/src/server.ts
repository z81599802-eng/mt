import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app.js';
import { logger } from './utils/logger.js';
import { registerSocket } from './utils/socket.js';

dotenv.config();

const port = Number(process.env.PORT ?? 4000);
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
registerSocket(io);

io.on('connection', (socket) => {
  logger.info('Socket connected', { id: socket.id });
  socket.on('disconnect', () => logger.info('Socket disconnected', { id: socket.id }));
});

server.listen(port, () => {
  logger.info(`API server running on port ${port}`);
});
