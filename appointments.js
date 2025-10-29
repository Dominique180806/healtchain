// backend/routes/appointments.js
const express = require('express');
const router = express.Router();
const { sendRdvMessage } = require('../services/hcs-rdv');
const db = require('../db');

// === Demande de RDV ===
router.post('/request', async (req, res) => {
  const { patientEmail, doctorEmail, date, time, motif } = req.body;

  if (!patientEmail || !doctorEmail || !date || !time) {
    return res.status(400).json({ error: 'Champs manquants' });
  }

  try {
    const requestId = Date.now();

    // Sauvegarde en DB
    await db.runAsync(
      `INSERT INTO appointments (id, patient_email, doctor_email, date, time, motif, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [requestId, patientEmail, doctorEmail, date, time, motif, 'pending']
    );

    // Envoi HCS
    await sendRdvMessage({
      type: 'REQUEST',
      requestId,
      patientEmail,
      doctorEmail,
      date,
      time,
      motif
    });

    // WebSocket en temps réel
    const broadcastRdv = req.app.get('broadcastRdv');
    if (broadcastRdv) {
      broadcastRdv(doctorEmail, {
        type: 'RDV_REQUEST',
        requestId,
        patientEmail,
        doctorEmail,
        date,
        time,
        motif
      });
    }

    res.json({ success: true, requestId });
  } catch (error) {
    console.error('Erreur RDV request:', error);
    res.status(500).json({ error: error.message });
  }
});

// === Réponse RDV ===
router.post('/respond', async (req, res) => {
  const { requestId, doctorEmail, patientEmail, accepted, reason } = req.body;

  try {
    // Mise à jour DB
    await db.runAsync(
      `UPDATE appointments SET status = ? WHERE id = ?`,
      [accepted ? 'confirmed' : 'rejected', requestId]
    );

    // Envoi HCS
    await sendRdvMessage({
      type: 'RESPONSE',
      requestId,
      doctorEmail,
      patientEmail,
      accepted,
      reason: accepted ? null : reason
    });

    // WebSocket
    const broadcastRdv = req.app.get('broadcastRdv');
    if (broadcastRdv) {
      broadcastRdv(patientEmail, {
        type: 'RDV_RESPONSE',
        requestId,
        accepted,
        reason
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erreur réponse RDV:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;