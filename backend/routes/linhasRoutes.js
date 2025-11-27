const express = require('express');
const router = express.Router();
const linhasController = require('../controllers/linhasController');

// Rota: GET /api/linhas/disponiveis (Usada pelo Painel da Diretoria ao abrir)
router.get('/disponiveis', linhasController.getLinhasDisponiveis);

module.exports = router;