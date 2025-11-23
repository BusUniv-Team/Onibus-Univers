// queries com pool.execute
// backend/models/usuario.js
// backend/src/models/usuario.js
const pool = require("../config/database");

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

  // validação extra pra evitar valores undefined no array
  const nomeVal = nome ?? null;
  const emailVal = email ?? null;
  const cpfVal = cpf ?? null;
  const semestreVal = semestre ?? null;
  const turnoVal = turno ?? null;
  const comprovanteVal = comprovante ?? null; // string 'uploads/xxx.pdf'
  const faculdadeVal = faculdade ?? null;
  const telefoneVal = telefone ?? null;
  const cargoVal = cargo ?? "aluno";
  const cursoVal = curso ?? null;
  const senhaVal = senhaHash ?? null;

  const sql = `
    INSERT INTO usuario
      (Nome, Email, CPF, Semestre, Turno, Comprovante, Faculdade, Telefone, Cargos, Curso, senha)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    nomeVal,
    emailVal,
    cpfVal,
    semestreVal,
    turnoVal,
    comprovanteVal,
    faculdadeVal,
    telefoneVal,
    cargoVal,
    cursoVal,
    senhaVal,
  ];

  console.log("DEBUG -> params para pool.execute:", params);

  const [result] = await pool.execute(sql, params);
  return result.insertId;
}

module.exports = {
  criarUsuario,
};
