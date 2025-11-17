
const pool = require("../config/database");

// Função para criar um novo usuário
async function criarUsuario(dados) {
  const {
    nome,
    email,
    cpf,
    semestre,
    turno,
    comprovante,
    faculdade,
    telefone,
    cargo,
    curso,
    senhaHash,
  } = dados;

  const sql = `
    INSERT INTO usuarios 
      (Nome, Email, CPF, Semestre, Turno, Comprovante, Faculdade, Telefone, Cargos, Curso, senha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    nome,
    email,
    cpf,
    semestre,
    turno,
    comprovante,
    faculdade,
    telefone,
    cargo,
    curso,
    senhaHash,
  ];

  
  const [result] = await pool.execute(sql, params);
  return result.insertId; // id_us gerado no AUTO_INCREMENT
}

module.exports = {
  criarUsuario,
};
