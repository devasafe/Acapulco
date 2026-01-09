const jwt = require('jsonwebtoken');
const User = require('../models/User');
let io = null;

function init(server) {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  // Middleware: verify JWT and admin role on handshake
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Token não fornecido'));
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      const user = await User.findById(decoded.userId);
      if (!user || !user.isAdmin) return next(new Error('Acesso negado - admin apenas'));
      // attach user info to socket
      socket.userId = user._id.toString();
      socket.isAdmin = !!user.isAdmin;
      next();
    } catch (err) {
      next(new Error('Token inválido'));
    }
  });

  io.on('connection', (socket) => {
    // join a room for admins (useful for broadcasting)
    if (socket.isAdmin) {
      socket.join('admins');
      console.log(`Admin conectado: ${socket.userId}`);
    } else {
      // Also allow regular users to join their own room for personal updates
      socket.join(`user_${socket.userId}`);
      console.log(`Usuário conectado: ${socket.userId}`);
    }
    socket.on('disconnect', () => {});
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}

module.exports = { init, getIO };
