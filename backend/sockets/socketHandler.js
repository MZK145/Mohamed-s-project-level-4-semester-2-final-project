// sockets/socketHandler.js
// Tracks authenticated users and station-room presence.
const onlineUsers = new Map(); // userId -> Set(socket ids)
const socketStations = new Map(); // socket id -> stationId

function normalizeId(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim();
  return normalized || null;
}

function stationRoom(stationId) {
  return `station:${stationId}`;
}

function getRoomCount(io, stationId) {
  const room = io.sockets.adapter.rooms.get(stationRoom(stationId));
  return room ? room.size : 0;
}

function emitPresence(io, stationId) {
  if (!stationId) return;
  io.to(stationRoom(stationId)).emit('presenceUpdate', {
    stationId,
    count: getRoomCount(io, stationId)
  });
}

function unregisterSocket(socketId) {
  for (const [userId, sockets] of onlineUsers) {
    if (!sockets.has(socketId)) continue;
    sockets.delete(socketId);
    if (sockets.size === 0) onlineUsers.delete(userId);
    return userId;
  }
  return null;
}

function leaveStation(io, socket) {
  const oldStationId = socketStations.get(socket.id);
  if (!oldStationId) return null;

  socket.leave(stationRoom(oldStationId));
  socketStations.delete(socket.id);
  emitPresence(io, oldStationId);
  return oldStationId;
}

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);
    socket.emit('onlineCount', getOnlineCount());

    socket.on('register', (rawUserId) => {
      const userId = normalizeId(rawUserId);
      if (!userId) {
        socket.emit('registerError', { message: 'A valid user id is required' });
        return;
      }

      unregisterSocket(socket.id);
      onlineUsers.set(userId, onlineUsers.get(userId) || new Set());
      onlineUsers.get(userId).add(socket.id);
      socket.data.userId = userId;

      socket.emit('registered', { userId });
      io.emit('onlineCount', getOnlineCount());
      console.log(`👤 User ${userId} online (${onlineUsers.get(userId).size} socket(s))`);
    });

    socket.on('joinStation', (rawStationId) => {
      const stationId = normalizeId(rawStationId);
      if (!stationId) {
        socket.emit('stationError', { message: 'A valid station id is required' });
        return;
      }

      const oldStationId = socketStations.get(socket.id);
      if (oldStationId === stationId) {
        emitPresence(io, stationId);
        return;
      }

      if (oldStationId) leaveStation(io, socket);

      socket.join(stationRoom(stationId));
      socketStations.set(socket.id, stationId);
      console.log(`🚉 ${socket.id} joined station room ${stationId}`);
      emitPresence(io, stationId);
    });

    socket.on('leaveStation', () => {
      const stationId = leaveStation(io, socket);
      if (stationId) console.log(`🚉 ${socket.id} left station room ${stationId}`);
    });

    socket.on('disconnect', (reason) => {
      const stationId = leaveStation(io, socket);
      const userId = unregisterSocket(socket.id);

      if (stationId) emitPresence(io, stationId);
      if (userId) io.emit('onlineCount', getOnlineCount());

      console.log(`🔌 Socket ${socket.id} disconnected (${reason})`);
    });
  });
}

function getOnlineCount() {
  return onlineUsers.size;
}

module.exports = { socketHandler, getOnlineCount };
