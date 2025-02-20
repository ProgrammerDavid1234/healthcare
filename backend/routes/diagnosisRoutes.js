const express = require('express');
const { analyzeSymptoms, getPossibleConditions } = require('../controllers/diagnosisController');
const router = express.Router();

router.post('/analyze', analyzeSymptoms);
router.get('/conditions', getPossibleConditions);

module.exports = router;