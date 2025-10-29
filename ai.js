// /server/routes/ai.js
const express = require('express');
const router = express.Router();

const symptomMap = {
  'mal de tête': 'Neurologue',
  'fièvre': 'Généraliste',
  'douleur poitrine': 'Cardiologue',
  'éruption peau': 'Dermatologue',
  'douleur articulaire': 'Rhumatologue',
  'problème vue': 'Ophtalmologue',
  'douleur oreille': 'ORL',
  'problème dent': 'Dentiste',
  'fatigue': 'Généraliste',
  'nausée': 'Généraliste',
};

router.post('/suggest-specialty', (req, res) => {
  const { symptoms } = req.body;
  const lowerSymptoms = symptoms.toLowerCase();

  for (const [symptom, specialty] of Object.entries(symptomMap)) {
    if (lowerSymptoms.includes(symptom)) {
      return res.json({ specialty });
    }
  }

  res.json({ specialty: 'Généraliste' });
});

module.exports = router;    