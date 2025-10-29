// server/routes/doctors.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/all', (req, res) => {
  const sql = `
    SELECT
      email as id,
      fullName,
      JSON_EXTRACT(specialties, '$[0]') as specialty,
      hospital,
      address,
      country,
      region,
      experienceYears as yearsExperience,
      profileImage as photo
    FROM doctors
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Erreur DB:', err);
      return res.status(500).json({ error: 'Erreur base de données' });
    }

    const processed = rows.map(row => ({
      id: row.id,
      fullName: row.fullName || 'Dr. Inconnu',
      specialty: row.specialty ? JSON.parse(`"${row.specialty}"`) : 'Généraliste',
      hospital: row.hospital || 'Non précisé',
      address: row.address || 'Non précisé',
      country: row.country || 'Non précisé',
      region: row.region || 'Non précisé',
      yearsExperience: row.yearsExperience || 0,
      photo: row.photo ? `http://localhost:5000/${row.photo}` : '/default-doctor.png'
    }));

    res.json(processed);
  });
});

module.exports = router;