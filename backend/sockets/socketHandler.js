// sockets/socketHandler.js
const onlineUsers = new Map(); // userId -> Set of socket ids

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected');

    socket.on('register', (userId) => {
      if (!userId) return;
      if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
      }
      onlineUsers.get(userId).add(socket.id);
      io.emit('onlineCount', getOnlineCount()); // broadcast to all clients (optional)
      console.log(`👤 User ${userId} online (${onlineUsers.get(userId).size} sockets)`);
    });

    socket.on('disconnect', () => {
      for (const [userId, sockets] of onlineUsers) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          if (sockets.size === 0) {
            onlineUsers.delete(userId);
          }
          io.emit('onlineCount', getOnlineCount());
          console.log(`👤 User ${userId} disconnected`);
          break;
        }
      }
    });
  });
}

function getOnlineCount() {
  return onlineUsers.size;
}

module.exports = { socketHandler, getOnlineCount };