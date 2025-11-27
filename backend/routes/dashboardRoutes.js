const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Rota para buscar os dados da tela inicial (Votos + Motorista atual)
router.get('/contagem/current-votes', dashboardController.getDashboardData);

// Rota para o Painel da Diretoria SALVAR a escolha
// Adicionamos um console.log aqui para saber se a requisição chegou
router.post('/definir-rota', (req, res, next) => {
    console.log(`--- DEBUG ROTA POST: Requisição recebida em /definir-rota`);
    console.log('Payload Body:', req.body);
    next(); // Continua para o Controller
}, dashboardController.updateRota);

module.exports = router;