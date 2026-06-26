// src/middleware/validate.middleware.js
import { z } from "zod";

// ---------------------------------------------------------------------------
// Zod-based request validation middleware.
// Usage: router.post('/route', validate(schema), controller)
// ---------------------------------------------------------------------------

export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      const errors = err.errors?.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return res.status(400).json({
        error: "Validation failed",
        errors,
      });
    }
  };
}

// ---------------------------------------------------------------------------
// Reusable schemas — import these in routes
// ---------------------------------------------------------------------------

export const schemas = {
  // --- Auth ---
  register: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["ADMIN", "OPERATOR"]).optional(),
  }),

  login: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),

  // --- Events ---
  createEvent: z.object({
    event_id: z.string().uuid("event_id must be a UUID"),
    timestamp: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "timestamp must be a valid date string",
      }),
    label: z.string().min(1),
    confidence: z.number().min(0).max(1),
    bbox: z.object({
      x1: z.number().int(),
      y1: z.number().int(),
      x2: z.number().int(),
      y2: z.number().int(),
    }),
    severity: z.enum(["low", "medium", "high", "critical"]),
    threat_score: z.number().min(0).max(1),
    loiter_seconds: z.number().min(0),
    frame_id: z.number().int(),
    source: z.string().default("ai_engine"),
    identity: z.string().nullable().optional(),
    person_name: z.string().nullable().optional(),
  }),

  // --- Persons ---
  createPerson: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    role: z.string().min(1, "Role is required"),
    faceImageB64: z.string().min(100, "Face image is required"),
  }),
};
