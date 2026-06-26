// src/routes/events.routes.js
import { Router } from 'express';
import {
  createEvent,
  getEvents,
  getEventById,
  getStats,
} from '../controllers/events.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate, schemas } from '../middleware/validate.middleware.js';

const router = Router();

// ---------------------------------------------------------------------------
// POST /api/events
// Called by AI engine — no auth required (internal service call)
// ---------------------------------------------------------------------------
router.post('/', validate(schemas.createEvent), createEvent);

// ---------------------------------------------------------------------------
// The routes below require a logged-in dashboard operator
// ---------------------------------------------------------------------------

// GET /api/events/stats  — must be before /:id to avoid conflict
router.get('/stats', protect, getStats);

// GET /api/events
router.get('/', protect, getEvents);

// GET /api/events/:id
router.get('/:id', protect, getEventById);

export default router;