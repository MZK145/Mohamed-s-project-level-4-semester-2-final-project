// sockets/socketHandler.js
// userId -> Set of active socket ids. A user is counted once even if they
// have multiple browser tabs/devices connected.
const onlineUsers = new Map();

function normalizeUserId(userId) {
  if (userId === null || userId === undefined) return null;
  const value = String(userId).trim();
  return value || null;
}

function broadcastOnlineCount(io) {
  io.emit('onlineCount', getOnlineCount());
}

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    // Send the current count immediately so a newly connected client never
    // has to wait for another user to register/disconnect.
    socket.emit('onlineCount', getOnlineCount());

    socket.on('register', (rawUserId) => {
      const userId = normalizeUserId(rawUserId);
      if (!userId) {
        console.warn(`⚠️ Socket ${socket.id} attempted registration without a user id`);
        socket.emit('registerError', { message: 'A valid user id is required' });
        return;
      }

      // Remove this socket from a previous user registration if the client
      // re-registers after login/account changes.
      unregisterSocket(socket.id);

      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }

      onlineUsers.get(userId).add(socket.id);
      socket.data.userId = userId;

      console.log(`👤 User ${userId} online (${onlineUsers.get(userId).size} socket(s))`);
      socket.emit('registered', { userId });
      broadcastOnlineCount(io);
    });

    socket.on('disconnect', (reason) => {
      const userId = socket.data.userId;
      const removed = unregisterSocket(socket.id);

      if (removed) {
        console.log(`👤 User ${userId} disconnected (${reason})`);
        broadcastOnlineCount(io);
      } else {
        console.log(`🔌 Unregistered socket disconnected: ${socket.id} (${reason})`);
      }
    });
  });
}

function unregisterSocket(socketId) {
  for (const [userId, sockets] of onlineUsers) {
    if (!sockets.has(socketId)) continue;

    sockets.delete(socketId);
    if (sockets.size === 0) {
      onlineUsers.delete(userId);
    }
    return userId;
  }
  return null;
}

function getOnlineCount() {
  return onlineUsers.size;
}

function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}

module.exports = { socketHandler, getOnlineCount, getOnlineUsers };
