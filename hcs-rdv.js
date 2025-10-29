// React/src/services/hcs-rdv.js
let socket = null;
let listeners = [];
let reconnectTimeout = null;
let isConnecting = false;

const WS_URL = 'ws://localhost:5000';

const connectWebSocket = (email) => {
  if (isConnecting || (socket && socket.readyState === WebSocket.OPEN)) return;

  isConnecting = true;
  console.log('Tentative de connexion WebSocket...');

  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log('WebSocket connecté');
    isConnecting = false;
    socket.send(JSON.stringify({ type: 'SUBSCRIBE', email }));
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      console.log('Message WebSocket reçu:', msg);
      if (msg.type === 'RDV_REQUEST' || msg.type === 'RDV_RESPONSE') {
        listeners.forEach(cb => cb(msg));
      }
    } catch (e) {
      console.error('Erreur parsing WS:', e);
    }
  };

  socket.onerror = (err) => {
    console.error('WebSocket erreur:', err);
  };

  socket.onclose = () => {
    console.log('WebSocket fermé');
    isConnecting = false;
    socket = null;

    // RECONNEXION AUTOMATIQUE
    if (!reconnectTimeout) {
      reconnectTimeout = setTimeout(() => {
        reconnectTimeout = null;
        connectWebSocket(email);
      }, 3000);
    }
  };
};

export const listenToRdvMessages = (callback) => {
  const email = localStorage.getItem('email');
  if (!email) return () => {};

  // Démarre la connexion
  connectWebSocket(email);

  listeners.push(callback);

  return () => {
    listeners = listeners.filter(cb => cb !== callback);
    if (listeners.length === 0 && socket) {
      socket.close();
      socket = null;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
    }
  };
};