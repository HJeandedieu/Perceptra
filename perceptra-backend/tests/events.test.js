// tests/events.test.js
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/prisma/client.js';

// ---------------------------------------------------------------------------
// Events endpoint tests
// ---------------------------------------------------------------------------

let authToken = '';
let createdEventId = '';

const testUser = {
  name:     'Events Tester',
  email:    'events@perceptra.test',
  password: 'testpassword123',
};

const validEvent = {
  event_id:       '123e4567-e89b-12d3-a456-426614174000',
  timestamp:      new Date().toISOString(),
  label:          'knife',
  confidence:     0.87,
  bbox:           { x1: 100, y1: 150, x2: 200, y2: 400 },
  severity:       'high',
  threat_score:   0.696,
  loiter_seconds: 12.5,
  frame_id:       1042,
  source:         'ai_engine',
  identity:       'unknown',
  person_name:    null,
};

beforeAll(async () => {
  // Clean up
  await prisma.event.deleteMany({ where: { eventId: validEvent.event_id } });
  await prisma.user.deleteMany({ where: { email: testUser.email } });

  // Register and login
  await request(app).post('/api/auth/register').send(testUser);
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: testUser.email, password: testUser.password });

  authToken = res.body.token;
});

afterAll(async () => {
  await prisma.event.deleteMany({ where: { eventId: validEvent.event_id } });
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  await prisma.$disconnect();
});

// ------------------------------------------------------------------
// POST /api/events
// ------------------------------------------------------------------
describe('POST /api/events', () => {

  it('creates an event and returns 201', async () => {
    const res = await request(app)
      .post('/api/events')
      .send(validEvent);

    expect(res.status).toBe(201);
    expect(res.body.event.eventId).toBe(validEvent.event_id);
    expect(res.body.event.severity).toBe('high');
    expect(res.body.event.bbox).toEqual(validEvent.bbox);

    createdEventId = res.body.event.id;
  });

  it('returns 200 on duplicate event_id (idempotent)', async () => {
    const res = await request(app)
      .post('/api/events')
      .send(validEvent);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/already recorded/i);
  });

  it('rejects event with invalid severity', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ ...validEvent, event_id: 'new-uuid-1', severity: 'extreme' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('rejects event with missing required fields', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ label: 'knife', severity: 'high' });

    expect(res.status).toBe(400);
  });

  it('rejects event with confidence out of range', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ ...validEvent, event_id: 'new-uuid-2', confidence: 1.5 });

    expect(res.status).toBe(400);
  });

  it('rejects event with invalid bbox', async () => {
    const res = await request(app)
      .post('/api/events')
      .send({ ...validEvent, event_id: 'new-uuid-3', bbox: { x1: 100 } });

    expect(res.status).toBe(400);
  });

});

// ------------------------------------------------------------------
// GET /api/events
// ------------------------------------------------------------------
describe('GET /api/events', () => {

  it('returns paginated events list', async () => {
    const res = await request(app)
      .get('/api/events')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
    expect(res.body.meta).toBeDefined();
    expect(res.body.meta.total).toBeGreaterThan(0);
  });

  it('filters by severity', async () => {
    const res = await request(app)
      .get('/api/events?severity=high')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    res.body.data.forEach(e => expect(e.severity).toBe('high'));
  });

  it('filters by label', async () => {
    const res = await request(app)
      .get('/api/events?label=knife')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    res.body.data.forEach(e =>
      expect(e.label.toLowerCase()).toContain('knife')
    );
  });

  it('respects pagination params', async () => {
    const res = await request(app)
      .get('/api/events?page=1&limit=1')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(1);
    expect(res.body.meta.limit).toBe(1);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/events');
    expect(res.status).toBe(401);
  });

});

// ------------------------------------------------------------------
// GET /api/events/stats
// ------------------------------------------------------------------
describe('GET /api/events/stats', () => {

  it('returns summary stats', async () => {
    const res = await request(app)
      .get('/api/events/stats')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.stats).toBeDefined();
    expect(res.body.stats.total).toBeGreaterThan(0);
    expect(res.body.stats).toHaveProperty('critical');
    expect(res.body.stats).toHaveProperty('high');
    expect(res.body.stats).toHaveProperty('medium');
    expect(res.body.stats).toHaveProperty('today');
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app).get('/api/events/stats');
    expect(res.status).toBe(401);
  });

});

// ------------------------------------------------------------------
// GET /api/events/:id
// ------------------------------------------------------------------
describe('GET /api/events/:id', () => {

  it('returns a single event by id', async () => {
    const res = await request(app)
      .get(`/api/events/${createdEventId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.event.id).toBe(createdEventId);
    expect(res.body.event.bbox).toBeDefined();
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app)
      .get('/api/events/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app)
      .get(`/api/events/${createdEventId}`);

    expect(res.status).toBe(401);
  });

});