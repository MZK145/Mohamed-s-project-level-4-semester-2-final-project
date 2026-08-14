// server.js
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const { socketHandler } = require('./sockets/socketHandler');
const Station = require('./models/Station');

const PORT = Number(process.env.PORT) || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI is not configured');
  process.exit(1);
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['polling', 'websocket']
});

// Store io in app.locals for use in routes.
app.locals.io = io;

const defaultStations = [
  { name: 'Helwan', line: 'Line 1', order: 1, governorate: 'Cairo', city: 'Helwan' },
  { name: 'Maasara', line: 'Line 1', order: 2, governorate: 'Cairo', city: 'Helwan' },
  { name: 'Tora El-Asmant', line: 'Line 1', order: 3, governorate: 'Cairo', city: 'Helwan' },
  { name: 'El-Malek El-Saleh', line: 'Line 1', order: 4, governorate: 'Cairo', city: 'Helwan' },
  { name: 'Sadat', line: 'Line 1', order: 5, governorate: 'Cairo', city: 'Downtown' },
  { name: 'New El-Marg', line: 'Line 1', order: 6, governorate: 'Cairo', city: 'El-Marg' },
  { name: 'Shoubra El-Kheima', line: 'Line 2', order: 1, governorate: 'Qalyubia', city: 'Shoubra El-Kheima' },
  { name: 'Koliet El-Zeraa', line: 'Line 2', order: 2, governorate: 'Cairo', city: 'Shubra' },
  { name: 'Rod El-Farag', line: 'Line 2', order: 3, governorate: 'Cairo', city: 'Rod El-Farag' },
  { name: 'Giza', line: 'Line 2', order: 4, governorate: 'Giza', city: 'Giza' },
  { name: 'El-Mounib', line: 'Line 2', order: 5, governorate: 'Giza', city: 'Giza' },
  { name: 'Attaba', line: 'Line 3', order: 1, governorate: 'Cairo', city: 'Downtown' },
  { name: 'Bab El-Shaaria', line: 'Line 3', order: 2, governorate: 'Cairo', city: 'Downtown' },
  { name: 'Abbassia', line: 'Line 3', order: 3, governorate: 'Cairo', city: 'Abbassia' },
  { name: 'Cairo Airport', line: 'Line 3', order: 4, governorate: 'Cairo', city: 'Airport' }
];

async function seedDefaultStations() {
  console.log('🌱 Ensuring default stations exist...');
  for (const station of defaultStations) {
    await Station.updateOne(
      { name: station.name, line: station.line },
      { $setOnInsert: station },
      { upsert: true }
    );
  }
  console.log('✅ Default stations ensured');
}

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected');

    await seedDefaultStations();
    socketHandler(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err);
    process.exit(1);
  }
}

startServer();

module.exports = server;
