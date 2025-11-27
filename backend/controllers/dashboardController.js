// controllers/dashboardController.js (trechos atualizados)
const db = require('../config/database');

exports.getDashboardData = async (req, res) => {
  const { dia } = req.query;

  try {
    const [rotas] = await db.query(`
      SELECT ar.faculdade, l.nome_exibicao, l.grupo, l.id_linha
      FROM atribuicoes_rotas ar
      LEFT JOIN linhas l ON ar.id_linha = l.id_linha
      ORDER BY ar.faculdade
    `);

    console.log("DEBUG rotas:", rotas);

    const [votos] = await db.query(`
      SELECT faculdade, tipo_viagem, COUNT(*) as total 
      FROM viagens 
      WHERE dia_semana = ? 
      GROUP BY faculdade, tipo_viagem
    `, [dia]);

    const resposta = {
      anhanguera: { ida: 0, volta: 0, idaEVolta: 0, nome_exibicao: "Aguardando...", grupo: null, motorista: null, id_linha: null },
      unex:       { ida: 0, volta: 0, idaEVolta: 0, nome_exibicao: "Aguardando...", grupo: null, motorista: null, id_linha: null },
      uesc:       { ida: 0, volta: 0, idaEVolta: 0, nome_exibicao: "Aguardando...", grupo: null, motorista: null, id_linha: null }
    };

    const facSet = new Set();

    rotas.forEach(rota => {
      if (!rota || !rota.faculdade) return;

      const facKey = String(rota.faculdade).toLowerCase().trim();
      if (!resposta[facKey]) {
        console.warn(`Faculdade não mapeada encontrada: "${rota.faculdade}" -> "${facKey}"`);
        return;
      }

      if (facSet.has(facKey)) {
        console.warn(`Duplicata de atribuicao para ${facKey} — ignorando extras.`);
        return;
      }

      // rota.nome_exibicao pode vir como "Verde 01 - Gustavo" ou "Gran - Marquinhos"
      const raw = rota.nome_exibicao ? String(rota.nome_exibicao).trim() : "";

      // Extrai o motorista (parte depois do " - "), se existir
      let motorista = raw;
      if (raw.includes(" - ")) {
        const parts = raw.split(" - ");
        motorista = parts.slice(1).join(" - ").trim();
      }

      // Monta o nome de exibicao completo no padrão "Grupo - Motorista"
      let nomeCompleto = raw;
      // Se raw não contém grupo (por segurança), monte a partir de rota.grupo + motorista
      if ((!raw || !raw.includes(" - ")) && rota.grupo) {
        nomeCompleto = `${rota.grupo} - ${motorista}`;
      }

      resposta[facKey].nome_exibicao = nomeCompleto || "Aguardando...";
      resposta[facKey].motorista = motorista || null;
      resposta[facKey].grupo = rota.grupo || null;
      resposta[facKey].id_linha = rota.id_linha || null;

      facSet.add(facKey);
    });

    // Preenche contagens
    votos.forEach(voto => {
      const facul = voto.faculdade ? String(voto.faculdade).toLowerCase().trim() : null;
      if (facul && resposta[facul]) {
        if (voto.tipo_viagem === 'ida') resposta[facul].ida = voto.total;
        if (voto.tipo_viagem === 'volta') resposta[facul].volta = voto.total;
        if (voto.tipo_viagem === 'ida_volta' || voto.tipo_viagem === 'ida-e-volta') resposta[facul].idaEVolta = voto.total;
      }
    });

    return res.json(resposta);

  } catch (error) {
    console.error("Erro no Dashboard GET:", error);
    return res.status(500).json({ error: "Erro ao buscar dados do painel", details: error.message });
  }
};


// controllers/dashboardController.js - sobrescrever atribuição
// PATCH RÁPIDO -> resolve imediatamente
// controllers/dashboardController.js - updateRota (substitua a função antiga)
exports.updateRota = async (req, res) => {
  try {
    console.log("--- DEBUG ROTA POST: Requisição recebida em /definir-rota");
    console.log("Payload Body:", req.body);

    let { faculdade, id_linha } = req.body;
    if (!faculdade || !id_linha) {
      return res.status(400).json({ error: "Faculdade ou id_linha faltando." });
    }

    // normaliza faculdade pro formato da tabela (minúscula sem espaços extras)
    const facKey = String(faculdade).toLowerCase().trim();
    const idNumeric = Number(id_linha);

    // Grava com INSERT ON DUPLICATE para garantir que a linha exista/atualize
    const [result] = await db.query(
      `INSERT INTO atribuicoes_rotas (faculdade, id_linha, active)
       VALUES (?, ?, 1)
       ON DUPLICATE KEY UPDATE id_linha = VALUES(id_linha), active = 1`,
      [facKey, idNumeric]
    );

    console.log("DEBUG update result:", result);

    return res.json({ message: "Rota atualizada com sucesso!", affected: result.affectedRows });

  } catch (error) {
    console.error("Erro no Dashboard UPDATE:", error);
    return res.status(500).json({ error: "Erro ao atualizar rota", details: error.message });
  }
};
