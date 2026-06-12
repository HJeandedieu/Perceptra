// src/routes/persons.routes.js
import { Router } from 'express';
import {
  getPersons,
  getPersonById,
  createPerson,
  updatePerson,
  deletePerson,
} from '../controllers/persons.controller.js';
import { protect, requireRole } from '../middleware/auth.middleware.js';
import { validate, schemas } from '../middleware/validate.middleware.js';

const router = Router();

// ---------------------------------------------------------------------------
// GET /api/persons
// Called by AI engine at startup to load registered faces — no auth required
// ---------------------------------------------------------------------------
router.get('/', getPersons);

// ---------------------------------------------------------------------------
// Routes below require a logged-in operator
// ---------------------------------------------------------------------------

// GET /api/persons/:id
router.get('/:id', protect, getPersonById);

// POST /api/persons — register a new person
router.post('/', protect, validate(schemas.createPerson), createPerson);

// PUT /api/persons/:id — update person details or face image
router.put('/:id', protect, validate(schemas.createPerson.partial()), updatePerson);

// DELETE /api/persons/:id — admin only
router.delete('/:id', protect, requireRole('ADMIN'), deletePerson);

export default router;