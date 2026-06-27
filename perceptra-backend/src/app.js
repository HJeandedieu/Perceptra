// src/app.js
import express from 'express';
import cors from 'cors';
import authRoutes    from './routes/auth.routes.js';
import eventsRoutes  from './routes/events.routes.js';
import personsRoutes from './routes/persons.routes.js';

// ---------------------------------------------------------------------------
// Express app setup — middleware and routes only.
// HTTP server and WebSocket are wired in server.js.
// ---------------------------------------------------------------------------

const app = express();

// ------------------------------------------------------------------
// Middleware
// ------------------------------------------------------------------
app.use(cors({
  origin: [
    'https://perceptra-phi.vercel.app',
    'http://localhost:5173',
  ],
  credentials: true,
}))
app.use(express.json({ limit: '10mb' })); // 10mb for base64 face images
app.use(express.urlencoded({ extended: true }));

// ------------------------------------------------------------------
// Request logger (development only)
// ------------------------------------------------------------------
app.use((req, _res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ------------------------------------------------------------------
// Routes
// ------------------------------------------------------------------
app.use('/api/auth',    authRoutes);
app.use('/api/events',  eventsRoutes);
app.use('/api/persons', personsRoutes);

// ------------------------------------------------------------------
// Health check — separate from ai_engine's /health
// ------------------------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({
    status:    'ok',
    service:   'perceptra-backend',
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------------------------------
// 404 handler
// ------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ------------------------------------------------------------------
// Global error handler
// ------------------------------------------------------------------
app.use((err, _req, res, _next) => {
  console.error(`[error] ${err.message}`);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error:   err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

export default app;