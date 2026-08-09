require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const http = require('http');
const socketHandler = require('./sockets/socketHandler');

const PORT = process.env.PORT || 5000; // ✅ Updated to 3000
const MONGO_URI = process.env.MONGO_URI;

const server = http.createServer(app);
const io = require('socket.io')(server);

socketHandler(io);

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error('❌ DB connection error:', err));

module.exports = server;
