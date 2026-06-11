// PERCEPTRA Backend Server
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { WebSocketServer } from 'ws';

import authRoutes from './api/auth.js';
import detectionsRoutes from './api/detections.js';
import alertsRoutes from './api/alerts.js';
import reportsRoutes from './api/reports.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/detections' });

const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5174' }));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'PERCEPTRA Backend is running' });
});

// WebSocket handler for real-time detections
wss.on('connection', (ws) => {
  console.log('New dashboard client connected');

  ws.on('message', (message) => {
    console.log('Received from client:', message.toString());
  });

  ws.on('close', () => {
    console.log('Dashboard client disconnected');
  });
});

// Broadcast function to send detections to all connected clients
export const broadcastDetection = (detection) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(detection));
    }
  });
};

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/detections', detectionsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/reports', reportsRoutes);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 PERCEPTRA Backend running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket server ready on ws://localhost:${PORT}/ws/detections`);
  console.log(`📋 API Endpoints available:`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/logout`);
  console.log(`   - GET /api/auth/users (admin only)`);
  console.log(`   - POST /api/auth/users (admin only)`);
  console.log(`   - PUT /api/auth/users/:id (admin only)`);
  console.log(`   - DELETE /api/auth/users/:id (admin only)`);
  console.log(`   - POST /api/detections`);
  console.log(`   - GET /api/detections`);
  console.log(`   - GET /api/detections/:id`);
  console.log(`   - PUT /api/detections/:id`);
  console.log(`   - DELETE /api/detections/:id`);
  console.log(`   - GET /api/alerts`);
  console.log(`   - GET /api/alerts/:id`);
  console.log(`   - POST /api/alerts`);
  console.log(`   - PATCH /api/alerts/:id/dismiss`);
  console.log(`   - DELETE /api/alerts/:id`);
  console.log(`   - GET /api/reports`);
});
