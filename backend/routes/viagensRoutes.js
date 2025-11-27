const express = require('express');
const router = express.Router();
const controller = require('../controllers/viagensController');

// Rota POST: http://localhost:3001/api/enquete/votar
router.post('/enquete/votar', controller.salvarVotos);

// Rota GET: http://localhost:3001/api/dashboard/contagem/current-votes
router.get('/dashboard/contagem/current-votes', controller.obterDashboard);

module.exports = router;