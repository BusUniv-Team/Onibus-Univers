router.post('/api/enquete/votar', VotosController.salvarVotos);
router.get('/api/dashboard/contagem', votosController.obterContagem);