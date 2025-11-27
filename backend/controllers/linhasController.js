const db = require('../config/database'); 

// Controlador para listar todas as linhas/motoristas disponíveis
// Rota: GET /api/linhas/disponiveis
exports.getLinhasDisponiveis = async (req, res) => {
    try {
        // Usa a sintaxe correta com 'await' direto (sem callbacks)
        // O driver mysql2/promise retorna um array onde o primeiro item são as linhas (rows)
        const [linhas] = await db.query(`
            SELECT id_linha, nome_exibicao, grupo 
            FROM linhas 
            ORDER BY grupo, nome_exibicao
        `);
        
        // Retorna a lista para o front-end preencher os menus suspensos
        return res.json(linhas);

    } catch (error) {
        console.error("Erro ao buscar linhas disponíveis:", error);
        return res.status(500).json({ 
            error: "Erro ao buscar linhas disponíveis", 
            details: error.message 
        });
    }
};