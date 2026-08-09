const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Station = require('../models/Station');

jest.setTimeout(20000); // allow up to 20s for Atlas

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  // Seed one test station
  await Station.create({ name: 'Test Station', line: 'Line 1', order: 1 });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // clean test DB
  await mongoose.connection.close();
});

describe('API Tests', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('GET /api/v1/stations returns 200 and array', async () => {
    const res = await request(app).get('/api/v1/stations');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
