// tests/persons.test.js
import request from 'supertest';
import app from '../src/app.js';
import prisma from '../src/prisma/client.js';

// ---------------------------------------------------------------------------
// Persons endpoint tests
// ---------------------------------------------------------------------------

let operatorToken = '';
let adminToken    = '';
let createdPersonId = '';

const operatorUser = {
  name:     'Operator User',
  email:    'operator.persons@perceptra.test',
  password: 'testpassword123',
  role:     'OPERATOR',
};

const adminUser = {
  name:     'Admin User',
  email:    'admin.persons@perceptra.test',
  password: 'testpassword123',
  role:     'ADMIN',
};

// Minimal valid base64 JPEG (1x1 white pixel)
const DUMMY_FACE_B64 =
  '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8U' +
  'HRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgN' +
  'DRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy' +
  'MjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB' +
  'AICAQIDAQIDAQIDAQIDAQIDAQIDAQIDAQIDAQIDAQIDAQIDAQIDAQIDAQIDAQIDAQID/8QA' +
  'FBABAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA' +
  'AAfVBmf8AoAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/AH//xAAUEQEAAAAA' +
  'AAAAAAAAAAAAAP/aAAgBAgEBPwB//8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAgBAwEB' +
  'PwB//9k=';

const testPerson = {
  name:         'Jean de Dieu',
  role:         'staff',
  faceImageB64: DUMMY_FACE_B64,
};

beforeAll(async () => {
  // Clean up
  await prisma.person.deleteMany({ where: { name: testPerson.name } });
  await prisma.user.deleteMany({
    where: { email: { in: [operatorUser.email, adminUser.email] } },
  });

  // Register operator
  await request(app).post('/api/auth/register').send(operatorUser);
  const opRes = await request(app)
    .post('/api/auth/login')
    .send({ email: operatorUser.email, password: operatorUser.password });
  operatorToken = opRes.body.token;

  // Register admin
  await request(app).post('/api/auth/register').send(adminUser);
  const adRes = await request(app)
    .post('/api/auth/login')
    .send({ email: adminUser.email, password: adminUser.password });
  adminToken = adRes.body.token;
});

afterAll(async () => {
  await prisma.person.deleteMany({ where: { name: testPerson.name } });
  await prisma.user.deleteMany({
    where: { email: { in: [operatorUser.email, adminUser.email] } },
  });
  await prisma.$disconnect();
});

// ------------------------------------------------------------------
// GET /api/persons  — public (AI engine access)
// ------------------------------------------------------------------
describe('GET /api/persons', () => {

  it('returns persons list without auth', async () => {
    const res = await request(app).get('/api/persons');

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('returns face_image_b64 field for AI engine', async () => {
    // Register a person first so list is not empty
    await request(app)
      .post('/api/persons')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send(testPerson);

    const res = await request(app).get('/api/persons');

    expect(res.status).toBe(200);
    const person = res.body.find(p => p.name === testPerson.name);
    expect(person).toBeDefined();
    expect(person.face_image_b64).toBeDefined();
  });

});

// ------------------------------------------------------------------
// POST /api/persons
// ------------------------------------------------------------------
describe('POST /api/persons', () => {

  it('operator can register a person', async () => {
    // Delete if already created in GET test above
    await prisma.person.deleteMany({ where: { name: testPerson.name } });

    const res = await request(app)
      .post('/api/persons')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send(testPerson);

    expect(res.status).toBe(201);
    expect(res.body.person.name).toBe(testPerson.name);
    expect(res.body.person.role).toBe(testPerson.role);

    createdPersonId = res.body.person.id;
  });

  it('rejects duplicate name', async () => {
    const res = await request(app)
      .post('/api/persons')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send(testPerson);

    expect(res.status).toBe(409);
    expect(res.body.error).toMatch(/already registered/i);
  });

  it('rejects missing name', async () => {
    const res = await request(app)
      .post('/api/persons')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ role: 'staff', faceImageB64: DUMMY_FACE_B64 });

    expect(res.status).toBe(400);
  });

  it('rejects missing faceImageB64', async () => {
    const res = await request(app)
      .post('/api/persons')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ name: 'No Face', role: 'staff' });

    expect(res.status).toBe(400);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app)
      .post('/api/persons')
      .send(testPerson);

    expect(res.status).toBe(401);
  });

});

// ------------------------------------------------------------------
// GET /api/persons/:id
// ------------------------------------------------------------------
describe('GET /api/persons/:id', () => {

  it('returns a single person by id', async () => {
    const res = await request(app)
      .get(`/api/persons/${createdPersonId}`)
      .set('Authorization', `Bearer ${operatorToken}`);

    expect(res.status).toBe(200);
    expect(res.body.person.id).toBe(createdPersonId);
    expect(res.body.person.name).toBe(testPerson.name);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app)
      .get('/api/persons/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${operatorToken}`);

    expect(res.status).toBe(404);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app)
      .get(`/api/persons/${createdPersonId}`);

    expect(res.status).toBe(401);
  });

});

// ------------------------------------------------------------------
// PUT /api/persons/:id
// ------------------------------------------------------------------
describe('PUT /api/persons/:id', () => {

  it('operator can update a person role', async () => {
    const res = await request(app)
      .put(`/api/persons/${createdPersonId}`)
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ role: 'student' });

    expect(res.status).toBe(200);
    expect(res.body.person.role).toBe('student');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app)
      .put('/api/persons/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${operatorToken}`)
      .send({ role: 'visitor' });

    expect(res.status).toBe(404);
  });

  it('rejects unauthenticated request', async () => {
    const res = await request(app)
      .put(`/api/persons/${createdPersonId}`)
      .send({ role: 'visitor' });

    expect(res.status).toBe(401);
  });

});

// ------------------------------------------------------------------
// DELETE /api/persons/:id
// ------------------------------------------------------------------
describe('DELETE /api/persons/:id', () => {

  it('operator cannot delete a person', async () => {
    const res = await request(app)
      .delete(`/api/persons/${createdPersonId}`)
      .set('Authorization', `Bearer ${operatorToken}`);

    expect(res.status).toBe(403);
  });

  it('admin can delete a person', async () => {
    const res = await request(app)
      .delete(`/api/persons/${createdPersonId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/removed successfully/i);
  });

  it('returns 404 after deletion', async () => {
    const res = await request(app)
      .get(`/api/persons/${createdPersonId}`)
      .set('Authorization', `Bearer ${operatorToken}`);

    expect(res.status).toBe(404);
  });

});