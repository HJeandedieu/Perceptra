// src/controllers/persons.controller.js
import prisma from '../prisma/client.js';

// ---------------------------------------------------------------------------
// Persons controller — manages registered individuals in the system.
// The AI engine calls GET /api/persons to load face embeddings at startup.
// ---------------------------------------------------------------------------

// ------------------------------------------------------------------
// GET /api/persons
// Called by ai_engine/identity/embeddings.py on startup
// ------------------------------------------------------------------
export async function getPersons(_req, res) {
  try {
    const persons = await prisma.person.findMany({
      orderBy: { registeredAt: 'desc' },
      select: {
        id:           true,
        name:         true,
        role:         true,
        faceImageB64: true,
        registeredAt: true,
      },
    });

    // Shape matches exactly what embeddings.py expects:
    // [{ name, face_image_b64 }, ...]
    const payload = persons.map(p => ({
      id:             p.id,
      name:           p.name,
      role:           p.role,
      face_image_b64: p.faceImageB64,
      registered_at:  p.registeredAt,
    }));

    return res.status(200).json(payload);

  } catch (err) {
    console.error('[persons] Get error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch persons' });
  }
}

// ------------------------------------------------------------------
// GET /api/persons/:id
// ------------------------------------------------------------------
export async function getPersonById(req, res) {
  try {
    const person = await prisma.person.findUnique({
      where: { id: req.params.id },
    });

    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }

    return res.status(200).json({
      person: formatPerson(person),
    });

  } catch (err) {
    console.error('[persons] GetById error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch person' });
  }
}

// ------------------------------------------------------------------
// POST /api/persons
// Register a new person with their face image
// ------------------------------------------------------------------
export async function createPerson(req, res) {
  const { name, role, faceImageB64 } = req.body;

  try {
    // Check for duplicate name
    const existing = await prisma.person.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (existing) {
      return res.status(409).json({
        error: `Person '${name}' is already registered`,
      });
    }

    const person = await prisma.person.create({
      data: { name, role, faceImageB64 },
    });

    console.log(`[persons] Registered: ${name} (${role})`);

    return res.status(201).json({
      message: 'Person registered successfully',
      person:  formatPerson(person),
    });

  } catch (err) {
    console.error('[persons] Create error:', err.message);
    return res.status(500).json({ error: 'Failed to register person' });
  }
}

// ------------------------------------------------------------------
// PUT /api/persons/:id
// Update name, role, or face image
// ------------------------------------------------------------------
export async function updatePerson(req, res) {
  const { name, role, faceImageB64 } = req.body;

  try {
    const existing = await prisma.person.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Person not found' });
    }

    const updated = await prisma.person.update({
      where: { id: req.params.id },
      data: {
        ...(name         && { name }),
        ...(role         && { role }),
        ...(faceImageB64 && { faceImageB64 }),
      },
    });

    console.log(`[persons] Updated: ${updated.name}`);

    return res.status(200).json({
      message: 'Person updated successfully',
      person:  formatPerson(updated),
    });

  } catch (err) {
    console.error('[persons] Update error:', err.message);
    return res.status(500).json({ error: 'Failed to update person' });
  }
}

// ------------------------------------------------------------------
// DELETE /api/persons/:id
// Admin only — enforced in the route
// ------------------------------------------------------------------
export async function deletePerson(req, res) {
  try {
    const existing = await prisma.person.findUnique({
      where: { id: req.params.id },
    });

    if (!existing) {
      return res.status(404).json({ error: 'Person not found' });
    }

    await prisma.person.delete({ where: { id: req.params.id } });

    console.log(`[persons] Deleted: ${existing.name}`);

    return res.status(200).json({
      message: `Person '${existing.name}' removed successfully`,
    });

  } catch (err) {
    console.error('[persons] Delete error:', err.message);
    return res.status(500).json({ error: 'Failed to delete person' });
  }
}

// ------------------------------------------------------------------
// Internal helper
// ------------------------------------------------------------------
function formatPerson(person) {
  return {
    id:           person.id,
    name:         person.name,
    role:         person.role,
    registeredAt: person.registeredAt,
    updatedAt:    person.updatedAt,
    // faceImageB64 excluded from general responses for performance
    // returned only by GET /api/persons (for AI engine)
  };
}