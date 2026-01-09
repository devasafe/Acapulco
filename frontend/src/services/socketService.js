import { io as ioClient } from 'socket.io-client';

let socket = null;

export function connectSocket(token) {
  if (socket) return socket;
  const url = process.env.REACT_APP_SOCKET_URL || (process.env.REACT_APP_API_URL || 'http://localhost:5000');
  socket = ioClient(url, {
    auth: { token }
  });
  socket.on('connect_error', (err) => {
    console.error('Erro de conexão do socket:', err.message || err);
  });
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  return socket;
}
