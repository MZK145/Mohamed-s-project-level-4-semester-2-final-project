const mongoose = require('mongoose');

const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  line: { type: String, required: true },
  order: { type: Number, required: true },
  arrivalTime: { type: String, default: '00:00' },
  departureTime: { type: String, default: '00:05' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Station', stationSchema);