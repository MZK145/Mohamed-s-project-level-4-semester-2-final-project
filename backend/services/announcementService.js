const Announcement = require('../models/Announcement');

exports.fetchAnnouncements = async (stationId, { page = 1, limit = 10 }) => {
  return await Announcement.find({ stationId })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));
};

exports.createAnnouncement = async (stationId, data) => {
  const announcement = new Announcement({ stationId, ...data });
  return await announcement.save();
};
