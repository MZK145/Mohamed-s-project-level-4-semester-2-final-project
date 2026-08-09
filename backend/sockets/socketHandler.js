function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('🔌 New client connected');

    socket.on('joinStation', (stationId) => {
      socket.join(stationId);
      io.to(stationId).emit('presenceUpdate', { viewers: io.sockets.adapter.rooms.get(stationId)?.size || 0 });
    });

    socket.on('leaveStation', (stationId) => {
      socket.leave(stationId);
    });
  });
}

module.exports = socketHandler;
