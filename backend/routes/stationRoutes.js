const express = require('express');
const router = express.Router();
const Station = require('../models/Station');
const requireAdmin = require('../middleware/requireAdmin');

// GET all stations (public)
router.get('/', async (req, res, next) => {
  try {
    const stations = await Station.find().sort({ line: 1, order: 1 });
    res.status(200).json(stations);
  } catch (err) { next(err); }
});

// GET single station (public)
router.get('/:id', async (req, res, next) => {
  try {
    const station = await Station.findById(req.params.id);
    if (!station) return res.status(404).json({ error: 'Station not found' });
    res.status(200).json(station);
  } catch (err) { next(err); }
});

// ---------- ADMIN ONLY ----------
// POST create station
router.post('/', requireAdmin, async (req, res, next) => {
  try {
    const { name, line, order, arrivalTime, departureTime, governorate, city } = req.body;
    const station = new Station({ name, line, order, arrivalTime, departureTime, governorate, city });
    await station.save();

    const io = req.app.locals.io;
    io.emit('stationsUpdated');

    res.status(201).json(station);
  } catch (err) { next(err); }
});

// PUT update station (including schedule)
router.put('/:id', requireAdmin, async (req, res, next) => {
  try {
    const station = await Station.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!station) return res.status(404).json({ error: 'Station not found' });

    const io = req.app.locals.io;
    io.emit('stationsUpdated');

    res.status(200).json(station);
  } catch (err) { next(err); }
});

// DELETE station
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try {
    const station = await Station.findByIdAndDelete(req.params.id);
    if (!station) return res.status(404).json({ error: 'Station not found' });

    const io = req.app.locals.io;
    io.emit('stationsUpdated');

    res.status(200).json({ message: 'Station deleted' });
  } catch (err) { next(err); }
});

module.exports = router;