// src/controllers/events.controller.js
import prisma from '../prisma/client.js';
import { broadcast } from '../services/ws.service.js';
import { sendAlerts } from '../services/alert.service.js';

// ---------------------------------------------------------------------------
// Events controller — receives detection events from the AI engine,
// saves them to the DB, broadcasts to dashboard, triggers alerts.
// ---------------------------------------------------------------------------

// ------------------------------------------------------------------
// POST /api/events
// Called by ai_engine/bridge/publisher.py on every detection
// ------------------------------------------------------------------
export async function createEvent(req, res) {
  const {
    event_id,
    timestamp,
    label,
    confidence,
    bbox,
    severity,
    threat_score,
    loiter_seconds,
    frame_id,
    source,
    identity,
    person_name,
  } = req.body;

  try {
    // Check for duplicate — AI engine may retry on network hiccup
    const existing = await prisma.event.findUnique({
      where: { eventId: event_id },
    });
    if (existing) {
      return res.status(200).json({ message: 'Event already recorded', event: existing });
    }

    // Save to database
    const event = await prisma.event.create({
      data: {
        eventId:       event_id,
        timestamp:     new Date(timestamp),
        label,
        confidence,
        bboxX1:        bbox.x1,
        bboxY1:        bbox.y1,
        bboxX2:        bbox.x2,
        bboxY2:        bbox.y2,
        severity,
        threatScore:   threat_score,
        loiterSeconds: loiter_seconds,
        frameId:       frame_id,
        source:        source || 'ai_engine',
        identity:      identity  || null,
        personName:    person_name || null,
        alertSent:     false,
      },
    });

    // Broadcast to dashboard via WebSocket
    broadcast(formatEventPayload(event));

    // Send SMS + email alerts for high/critical
    if (['high', 'critical'].includes(severity)) {
      sendAlerts(formatEventPayload(event))
        .then(() => {
          prisma.event.update({
            where: { id: event.id },
            data:  { alertSent: true },
          }).catch(console.error);
        })
        .catch(err => console.error('[events] Alert failed:', err.message));
    }

    return res.status(201).json({
      message: 'Event recorded',
      event:   formatEventPayload(event),
    });

  } catch (err) {
    console.error('[events] Create error:', err.message);
    return res.status(500).json({ error: 'Failed to record event' });
  }
}

// ------------------------------------------------------------------
// GET /api/events
// Returns paginated event history for the dashboard
// Query params: page, limit, severity, label, from, to
// ------------------------------------------------------------------
export async function getEvents(req, res) {
  const {
    page     = 1,
    limit    = 50,
    severity,
    label,
    from,
    to,
  } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const take = parseInt(limit);

  // Build dynamic filters
  const where = {};
  if (severity) where.severity = severity;
  if (label)    where.label    = { contains: label, mode: 'insensitive' };
  if (from || to) {
    where.timestamp = {};
    if (from) where.timestamp.gte = new Date(from);
    if (to)   where.timestamp.lte = new Date(to);
  }

  try {
    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take,
      }),
      prisma.event.count({ where }),
    ]);

    return res.status(200).json({
      data: events.map(formatEventPayload),
      meta: {
        total,
        page:       parseInt(page),
        limit:      take,
        totalPages: Math.ceil(total / take),
      },
    });

  } catch (err) {
    console.error('[events] Get error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}

// ------------------------------------------------------------------
// GET /api/events/:id
// ------------------------------------------------------------------
export async function getEventById(req, res) {
  try {
    const event = await prisma.event.findUnique({
      where: { id: req.params.id },
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    return res.status(200).json({ event: formatEventPayload(event) });

  } catch (err) {
    console.error('[events] GetById error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch event' });
  }
}

// ------------------------------------------------------------------
// GET /api/events/stats
// Summary counts for dashboard overview cards
// ------------------------------------------------------------------
export async function getStats(req, res) {
  try {
    const [total, critical, high, medium, today] = await Promise.all([
      prisma.event.count(),
      prisma.event.count({ where: { severity: 'critical' } }),
      prisma.event.count({ where: { severity: 'high' } }),
      prisma.event.count({ where: { severity: 'medium' } }),
      prisma.event.count({
        where: {
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return res.status(200).json({
      stats: { total, critical, high, medium, today },
    });

  } catch (err) {
    console.error('[events] Stats error:', err.message);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

// ------------------------------------------------------------------
// Internal helper — normalise DB row to API response shape
// ------------------------------------------------------------------
function formatEventPayload(event) {
  return {
    id:            event.id,
    eventId:       event.eventId,
    timestamp:     event.timestamp,
    label:         event.label,
    confidence:    event.confidence,
    bbox: {
      x1: event.bboxX1,
      y1: event.bboxY1,
      x2: event.bboxX2,
      y2: event.bboxY2,
    },
    severity:      event.severity,
    threatScore:   event.threatScore,
    loiterSeconds: event.loiterSeconds,
    frameId:       event.frameId,
    source:        event.source,
    identity:      event.identity,
    personName:    event.personName,
    alertSent:     event.alertSent,
    createdAt:     event.createdAt,
  };
}