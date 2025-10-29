// backend/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { createServer } = require('http');
const { Server } = require('ws'); // WebSocket

const authRouter = require('./routes/auth');
const appointmentsRouter = require('./routes/appointments');

const app = express();
const server = createServer(app);
const wss = new Server({ server }); // WebSocket sur même port

// === CORS ===
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(helmet());
app.use(bodyParser.json());

// === Routes ===
app.use('/api/auth', authRouter);
app.use('/api/doctors', require('./routes/doctors'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/appointments', appointmentsRouter);

app.use('/uploads', express.static('uploads', {
  setHeaders: (res, path) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    res.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }
}));

// === WebSocket pour RDV en temps réel ===
const clients = new Map(); // email → ws

wss.on('connection', (ws) => {
  console.log('Nouveau client WebSocket connecté');

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'SUBSCRIBE' && msg.email) {
        clients.set(msg.email, ws);
        console.log(`Utilisateur abonné: ${msg.email}`);
      }
    } catch (e) {
      console.error('Erreur message WS:', e);
    }
  });

  ws.on('close', () => {
    for (let [email, client] of clients) {
      if (client === ws) {
        clients.delete(email);
        console.log(`Utilisateur désabonné: ${email}`);
        break;
      }
    }
  });
});

// Fonction globale pour envoyer un message RDV
const broadcastRdv = (email, message) => {
  const client = clients.get(email);
  if (client && client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  } else {
    console.log(`Client non connecté: ${email}`);
  }
};

// Rendre broadcastRdv accessible aux routes
app.set('broadcastRdv', broadcastRdv);

// === Démarrage ===
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Serveur + WebSocket démarré sur http://localhost:${PORT}`);
});