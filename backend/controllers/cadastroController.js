// model e bcrypt importar depois
// const bcrypt = require("bcryptjs");
// const { criarUsuario } = require("../models/usuario");

// backend/controllers/cadastroController.js
// controllers/cadastroController.js
// controllers/cadastroController.js
const bcrypt = require('bcrypt');
const pool = require('../config/database'); // caso precise direto aqui
const { criarUsuario } = require('../models/usuario');

function normalizeCpf(cpf) {
  return String(cpf || '').replace(/[^\d]/g, '');
}

async function cadastrarUsuario(req, res) {
  // debug inicial
  console.log('--- NOVA REQ - timestamp:', new Date().toISOString());
  console.log('Headers:', req.headers['content-type']);
  console.log('Body (raw keys):', typeof req.body, Object.keys(req.body || {}));
  console.log('Body (full):', req.body);
  if (req.file) {
    console.log('File recebido:', {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size
    });
  } else {
    console.log('Nenhum arquivo (req.file === undefined)');
  }

  try {
    // pegar campos do body
    let { nome, email, cpf, turno, faculdade, telefone, curso, periodo, semestre } = req.body;

    // O front envia "periodo", mas o backend usa "semestre"
    // então pegamos o que vier:
    const semestreRaw = periodo ?? semestre;

    // validação para garantir que nunca é null
    if (!semestreRaw) {
      return res.status(400).json({ mensagem: "Semestre/Período é obrigatório" });
    }

    const semestreNum = Number(semestreRaw);
    if (isNaN(semestreNum) || semestreNum < 1 || semestreNum > 12) {
      return res.status(400).json({ mensagem: "Semestre inválido. Deve ser um número entre 1 e 12." });
    }


    if (!nome || !cpf || !email) {
      return res.status(400).json({ mensagem: "Nome, email e CPF obrigatórios" });
    }

    if (!req.file) {
      return res.status(400).json({ mensagem: "Comprovante (PDF) obrigatório" });
    }

    // normaliza CPF
    const cpfNorm = normalizeCpf(cpf);
    if (cpfNorm.length < 11) {
      return res.status(400).json({ mensagem: "CPF inválido" });
    }

    // checar duplicado corretamente no banco (normalizando também)
    const [existing] = await pool.execute(
      `SELECT id_us FROM usuario
       WHERE REPLACE(REPLACE(REPLACE(CPF, '.', ''), '-', ''), ' ', '') = ?`,
      [cpfNorm]
    );

    if (existing.length > 0) {
      return res.status(400).json({ mensagem: "CPF já cadastrado" });
    }

    // montar dados para inserir
    const comprovante = req.file.path; // caminho do arquivo salvo pelo multer
    const senhaHash = await bcrypt.hash(cpfNorm, 10); // senha = CPF normalizado

    const dados = {
      nome,
      email,
      cpf: cpfNorm,
      semestre: semestreNum,
      turno,
      comprovante,
      faculdade,
      telefone,
      cargo: 'aluno',
      curso,
      senhaHash
    };

    const novoId = await criarUsuario(dados);

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      id: novoId,
      redirect: "/login"
    });

  } catch (err) {
    console.error('❌ Erro no cadastrarUsuario:', err && (err.stack || err));

    if (err && (err.code === 'ER_DUP_ENTRY' || err.message === 'CPF_DUPLICADO' || err.message === 'DUPLICATE')) {
      // se o model passou qual chave duplicou, usamos essa informação
      if (err.dupKey && err.dupKey.toLowerCase().includes('email')) {
        return res.status(400).json({ mensagem: "Email já cadastrado" });
      }
      return res.status(400).json({ mensagem: "CPF já cadastrado" });
    }

    return res.status(500).json({ mensagem: "Erro interno ao processar cadastro." });
  }

}

module.exports = { cadastrarUsuario };

