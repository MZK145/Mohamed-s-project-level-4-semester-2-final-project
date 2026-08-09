const announcementService = require('../services/announcementService');

exports.getAnnouncements = async (req, res, next) => {
  try {
    const { id } = req.params;
    const announcements = await announcementService.fetchAnnouncements(id, req.query);
    res.status(200).json(announcements);
  } catch (err) {
    next(err);
  }
};

exports.createAnnouncement = async (req, res, next) => {
  try {
    const announcement = await announcementService.createAnnouncement(req.params.id, req.body);
    res.status(201).json(announcement);
  } catch (err) {
    next(err);
  }
};
