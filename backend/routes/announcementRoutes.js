const express = require('express');
const router = express.Router();
const announcementController = require('../controllers/announcementController');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/:id/announcements', announcementController.getAnnouncements);
router.post('/:id/announcements', requireAdmin, announcementController.createAnnouncement);

module.exports = router;
