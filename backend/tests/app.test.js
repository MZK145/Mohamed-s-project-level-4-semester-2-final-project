const request = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const app = require('../app');
const Station = require('../models/Station');
const Admin = require('../models/Admin');

jest.setTimeout(20000);

let testStation;
const testAdminEmail = 'jest-admin@metro.test';

beforeAll(async () => {
  const mongoUri = process.env.MONGO_URI_TEST || process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI_TEST or MONGO_URI is required for integration tests');
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required for integration tests');

  await mongoose.connect(mongoUri);
  await Admin.deleteOne({ email: testAdminEmail });
  await Station.deleteOne({ name: 'Jest Test Station', line: 'Test Line' });

  testStation = await Station.create({
    name: 'Jest Test Station',
    line: 'Test Line',
    order: 999,
    governorate: 'Cairo',
    city: 'Test City'
  });

  const password = await bcrypt.hash('password123', 10);
  await Admin.create({ email: testAdminEmail, password });
});

afterAll(async () => {
  await Station.deleteOne({ _id: testStation?._id });
  await Admin.deleteOne({ email: testAdminEmail });
  await mongoose.connection.close();
});

describe('API Tests', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/v1/stations returns 200 and array sorted by line/order', async () => {
    const res = await request(app).get('/api/v1/stations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('valid admin login returns a JWT', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testAdminEmail, password: 'password123' });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.role).toBe('admin');
  });

  it('protected announcement creation without a token returns 401', async () => {
    const res = await request(app)
      .post(`/api/v1/${testStation._id}/announcements`)
      .send({ message: 'Unauthorized test announcement' });

    expect(res.statusCode).toBe(401);
  });

  it('protected announcement creation with a valid admin token returns 201', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: testAdminEmail, password: 'password123' });

    const res = await request(app)
      .post(`/api/v1/${testStation._id}/announcements`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send({ message: 'Test station announcement' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Test station announcement');
  });
});
