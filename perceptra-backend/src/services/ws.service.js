// src/services/ws.service.js
import { WebSocketServer, WebSocket } from 'ws';

// ---------------------------------------------------------------------------
// WebSocket service — broadcasts detection events to all connected dashboard
// clients in real time. Attached to the same HTTP server as Express.
// ---------------------------------------------------------------------------

let wss = null;

// ------------------------------------------------------------------
// Init — call once from server.js
// ------------------------------------------------------------------

export function initWebSocket(server) {
  wss = new WebSocketServer({ server, path: '/ws/events' });

  wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    console.log(`[ws] Client connected: ${ip}`);

    // Send a welcome handshake
    ws.send(JSON.stringify({
      type:      'connected',
      message:   'Perceptra WebSocket live',
      timestamp: new Date().toISOString(),
    }));

    ws.on('close', () => {
      console.log(`[ws] Client disconnected: ${ip}`);
    });

    ws.on('error', (err) => {
      console.error(`[ws] Client error: ${err.message}`);
    });
  });

  wss.on('error', (err) => {
    console.error(`[ws] Server error: ${err.message}`);
  });

  console.log(`[ws] WebSocket server ready on /ws/events`);
}

// ------------------------------------------------------------------
// Broadcast — call from events.controller.js after saving an event
// ------------------------------------------------------------------

export function broadcast(payload) {
  if (!wss) return;

  const message = JSON.stringify({
    type:      'event',
    timestamp: new Date().toISOString(),
    data:      payload,
  });

  let sent = 0;

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      sent++;
    }
  });

  if (sent > 0) {
    console.log(`[ws] Broadcast to ${sent} client(s): ${payload.label} [${payload.severity}]`);
  }
}

// ------------------------------------------------------------------
// Stats — how many clients are currently connected
// ------------------------------------------------------------------

export function getConnectedClients() {
  if (!wss) return 0;
  return [...wss.clients].filter(c => c.readyState === WebSocket.OPEN).length;
}