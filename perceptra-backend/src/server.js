// src/server.js
import http from 'http';
import app from './app.js';
import config from './config/config.js';
import prisma from './prisma/client.js';
import { initWebSocket } from './services/ws.service.js';

// ---------------------------------------------------------------------------
// Entry point — creates HTTP server, attaches WebSocket, connects to DB.
// ---------------------------------------------------------------------------

const server = http.createServer(app);

// --- Attach WebSocket server ---
initWebSocket(server);

// --- Start server ---
server.listen(config.port, async () => {
  console.log('='.repeat(55));
  console.log('  PERCEPTRA Backend — Starting');
  console.log('='.repeat(55));

  // --- Test DB connection ---
  try {
    await prisma.$connect();
    console.log(`[db]     PostgreSQL connected`);
  } catch (err) {
    console.error(`[db]     Connection failed: ${err.message}`);
    process.exit(1);
  }

  console.log(`[server] Running on http://localhost:${config.port}`);
  console.log(`[ws]     WebSocket on ws://localhost:${config.port}/ws/events`);
  console.log(`[health] GET http://localhost:${config.port}/health`);
  console.log('='.repeat(55));
});

// --- Graceful shutdown ---
const shutdown = async (signal) => {
  console.log(`\n[server] ${signal} received — shutting down...`);
  await prisma.$disconnect();
  server.close(() => {
    console.log('[server] HTTP server closed.');
    process.exit(0);
  });
};

process.on('SIGINT',  () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

// --- Unhandled errors ---
process.on('unhandledRejection', (reason) => {
  console.error('[server] Unhandled rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[server] Uncaught exception:', err.message);
  process.exit(1);
});