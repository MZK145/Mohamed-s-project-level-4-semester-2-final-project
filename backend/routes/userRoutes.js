const express = require('express');
const router = express.Router();
const User = require('../models/User');
const requireAdmin = require('../middleware/requireAdmin');
const { getOnlineCount } = require('../sockets/socketHandler');

// GET total number of registered users (admin only)
router.get('/', requireAdmin, async (req, res, next) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ count });
  } catch (err) {
    next(err);
  }
});

// GET online users count (admin only) - real-time value from Socket.IO.
router.get('/online', requireAdmin, (req, res) => {
  res.status(200).json({ count: getOnlineCount() });
});

module.exports = router;
