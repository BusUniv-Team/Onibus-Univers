// queries com pool.execute
// backend/models/usuario.js
// models/usuario.js
const pool = require('../config/database');

async function criarUsuario(dados) {
  const sql = `
    INSERT INTO usuario
      (Nome, Email, CPF, Semestre, Turno, Comprovante, Faculdade, Telefone, Cargos, Curso, senha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    dados.nome, dados.email, dados.cpf, dados.semestre, dados.turno,
    dados.comprovante, dados.faculdade, dados.telefone, dados.cargo, dados.curso, dados.senhaHash
  ];

  console.log('DEBUG INSERT -> params:', params);

  try {
    const [result] = await pool.execute(sql, params);
    console.log('DEBUG INSERT -> success result:', result);
    return result.insertId;
  } catch (err) {
    console.error('DEBUG INSERT -> ERRO RAW code:', err.code);
    console.error('DEBUG INSERT -> ERRO RAW errno:', err.errno);
    console.error('DEBUG INSERT -> ERRO RAW sqlMessage:', err.sqlMessage);
    console.error('DEBUG INSERT -> ERRO RAW sqlState:', err.sqlState);
    console.error('DEBUG INSERT -> ERRO RAW sql:', err.sql);

    if (err && err.code === 'ER_DUP_ENTRY') {
      // identificar qual índice violado (sqlMessage traz isso)
      const dupMsg = err.sqlMessage || '';
      const field = dupMsg.match(/for key '(.+)'/) ? dupMsg.match(/for key '(.+)'/)[1] : null;
      const e = new Error('DUPLICATE');
      e.code = 'ER_DUP_ENTRY';
      e.dupKey = field; // passa qual índice causou
      throw e;
    }
    throw err;
  }
}

module.exports = { criarUsuario };


// busca de users por CPF

async function buscarUsuarioPorCPF(cpf) {
    try {
        const sql = "SELECT * FROM usuarios WHERE cpf = ?";
        const [rows] = await db.execute(sql, [cpf]);
        return rows[0];
    } catch (error) {
        throw error;
    }
}

module.exports = {
    criarUsuario,
    buscarUsuarioPorCPF
};


