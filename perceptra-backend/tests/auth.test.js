// tests/auth.test.js
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/prisma/client.js';

// ---------------------------------------------------------------------------
// Auth endpoint tests
// ---------------------------------------------------------------------------

const testUser = {
  name:     'Test Operator',
  email:    'operator@perceptra.test',
  password: 'testpassword123',
  role:     'OPERATOR',
};

let authToken = '';

beforeAll(async () => {
  // Clean up test user if exists from previous run
  await prisma.user.deleteMany({ where: { email: testUser.email } });
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: testUser.email } });
  await prisma.$disconnect();
});

// ------------------------------------------------------------------
// POST /api/auth/register
// ------------------------------------------------------------------
describe('POST /api/auth/register', () => {

  it('registers a new user and returns a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(testUser.email);
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already registered/i);
  });

  it('rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'not-an-email' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation failed');
  });

  it('rejects short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'other@test.com', password: '123' });

    expect(res.status).toBe(400);
  });

});

// ------------------------------------------------------------------
// POST /api/auth/login
// ------------------------------------------------------------------
describe('POST /api/auth/login', () => {

  it('logs in with correct credentials and returns token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('OPERATOR');

    authToken = res.body.token;
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/invalid/i);
  });

  it('rejects unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'ghost@perceptra.test', password: 'somepassword' });

    expect(res.status).toBe(401);
  });

});

// ------------------------------------------------------------------
// GET /api/auth/me
// ------------------------------------------------------------------
describe('GET /api/auth/me', () => {

  it('returns current user with valid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(testUser.email);
  });

  it('rejects request with no token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects request with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalidtoken123');

    expect(res.status).toBe(401);
  });

});