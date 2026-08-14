// server.js
require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const { socketHandler } = require('./sockets/socketHandler');
const Station = require('./models/Station');

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(app);
const io = require('socket.io')(server);

// Store io in app.locals for use in routes
app.locals.io = io;

// Complete list of default stations (with governorate & city)
const defaultStations = [
  { name: "Helwan", line: "Line 1", order: 1, governorate: "Cairo", city: "Helwan" },
  { name: "Maasara", line: "Line 1", order: 2, governorate: "Cairo", city: "Helwan" },
  { name: "Tora El-Asmant", line: "Line 1", order: 3, governorate: "Cairo", city: "Helwan" },
  { name: "El-Malek El-Saleh", line: "Line 1", order: 4, governorate: "Cairo", city: "Helwan" },
  { name: "Sadat", line: "Line 1", order: 5, governorate: "Cairo", city: "Downtown" },
  { name: "New El-Marg", line: "Line 1", order: 6, governorate: "Cairo", city: "El-Marg" },
  { name: "Shoubra El-Kheima", line: "Line 2", order: 1, governorate: "Qalyubia", city: "Shoubra El-Kheima" },
  { name: "Koliet El-Zeraa", line: "Line 2", order: 2, governorate: "Cairo", city: "Shubra" },
  { name: "Rod El-Farag", line: "Line 2", order: 3, governorate: "Cairo", city: "Rod El-Farag" },
  { name: "Giza", line: "Line 2", order: 4, governorate: "Giza", city: "Giza" },
  { name: "El-Mounib", line: "Line 2", order: 5, governorate: "Giza", city: "Giza" },
  { name: "Attaba", line: "Line 3", order: 1, governorate: "Cairo", city: "Downtown" },
  { name: "Bab El-Shaaria", line: "Line 3", order: 2, governorate: "Cairo", city: "Downtown" },
  { name: "Abbassia", line: "Line 3", order: 3, governorate: "Cairo", city: "Abbassia" },
  { name: "Cairo Airport", line: "Line 3", order: 4, governorate: "Cairo", city: "Airport" }
];

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Upsert default stations – add only if they don't already exist
    console.log('🌱 Ensuring default stations exist...');
    for (const station of defaultStations) {
      const exists = await Station.findOne({ name: station.name, line: station.line });
      if (!exists) {
        await Station.create(station);
        console.log(`  ➕ Added: ${station.name} (${station.line})`);
      }
    }
    console.log('✅ Default stations ensured');

    socketHandler(io);

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  });

module.exports = server;