const pool = require('../config/database'); // Verifique se o caminho do seu database está correto aqui

// --- MAPAS DE TRADUÇÃO (Front -> Banco) ---
const mapDias = {
  "SEG": "segunda", "TER": "terça", "QUA": "quarta", 
  "QUI": "quinta", "SEX": "sexta", "SÁB": "sabado", "DOM": "domingo"
};
const mapTrajeto = {
  "Só ida": "ida", "Só volta": "volta", "Ida e volta": "ida_e_volta"
};
const mapTurno = {
  "Diurno": "manha", "Noturno": "noturno"
};

const diasSemanaJS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

// 1. SALVAR VOTOS (Enquete)
exports.salvarVotos = async (req, res) => {
  const { faculdade, votos, id_usuario } = req.body; 
  const idUser = id_usuario || 1; 

  if (!votos || votos.length === 0) return res.status(200).json({ msg: "Nada a salvar" });

  try {
    const queries = votos.map(v => {
      const diaDB = mapDias[v.dia];
      const tipoDB = mapTrajeto[v.trajeto];
      const turnoDB = mapTurno[v.turno];

      if(!diaDB || !tipoDB || !turnoDB) return null;

      // CORREÇÃO AQUI: Mudado de 'viagens' para 'votos'
      return pool.execute(
        `INSERT INTO votos (id_us, dia_semana, faculdade, tipo_viagem, turno, data_registro) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [idUser, diaDB, faculdade, tipoDB, turnoDB]
      );
    });

    await Promise.all(queries);
    res.json({ success: true, msg: "Votos salvos!" });

  } catch (error) {
    console.error("Erro ao salvar:", error);
    res.status(500).json({ error: "Erro no banco ao salvar votos" });
  }
};

// 2. DASHBOARD (Tela Inicial)
exports.obterDashboard = async (req, res) => {
  try {
    const diaQuery = req.query.dia || diasSemanaJS[new Date().getDay()];
    const diaDB = mapDias[diaQuery]; 

    // CORREÇÃO AQUI: Mudado de 'viagens' para 'votos'
    const [rows] = await pool.execute(
      `SELECT faculdade, tipo_viagem, COUNT(*) as total 
       FROM votos 
       WHERE dia_semana = ? 
       GROUP BY faculdade, tipo_viagem`,
      [diaDB]
    );

    const resposta = {
      anhanguera: { ida: 0, volta: 0, idaEVolta: 0, nome: "Aguardando..." },
      unex:       { ida: 0, volta: 0, idaEVolta: 0, nome: "Aguardando..." },
      uesc:       { ida: 0, volta: 0, idaEVolta: 0, nome: "Aguardando..." }
    };

    rows.forEach(row => {
      const faculKey = row.faculdade ? row.faculdade.toLowerCase() : null;
      
      if (faculKey && resposta[faculKey]) {
        resposta[faculKey].nome = "Confirmado"; 
        
        if (row.tipo_viagem === 'ida') resposta[faculKey].ida = row.total;
        if (row.tipo_viagem === 'volta') resposta[faculKey].volta = row.total;
        if (row.tipo_viagem === 'ida_e_volta') resposta[faculKey].idaEVolta = row.total;
      }
    });

    res.json(resposta);

  } catch (error) {
    console.error("Erro dashboard:", error);
    res.status(500).json({ error: "Erro ao carregar dashboard" });
  }
};