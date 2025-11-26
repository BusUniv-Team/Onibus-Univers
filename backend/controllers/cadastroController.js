// model e bcrypt importar depois
// const bcrypt = require("bcryptjs");
// const { criarUsuario } = require("../models/usuario");

// backend/controllers/cadastroController.js
// controllers/cadastroController.js
const bcrypt = require('bcrypt');
const { criarUsuario } = require('../models/usuario');

async function cadastrarUsuario(req, res) {
  try {
    const {
      nome, email, cpf, semestre, turno, faculdade, telefone, curso, /* senha não vem no front */ 
    } = req.body;

    if (!nome || !cpf || !email) {
      return res.status(400).json({ mensagem: "Campos obrigatórios faltando" });
    }

    // comprovação enviado via multer
    if (!req.file) {
      return res.status(400).json({ mensagem: "Comprovante (PDF) obrigatório" });
    }

    const comprovante = req.file.path; // ex: uploads/xxx.pdf

    // senha padrão = cpf para alunos (cargo default = aluno)
    const senhaHash = await bcrypt.hash(cpf, 10);

    const dados = {
      nome, email, cpf,
      semestre: semestre ? Number(semestre) : null,
      turno, comprovante, faculdade, telefone,
      cargo: 'aluno', // padrão
      curso,
      senhaHash
    };

    const novoId = await criarUsuario(dados);

    // Retorna 201 e orienta o front a redirecionar para /login
    return res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      id: novoId,
      redirect: "/login"   // campo que o front pode usar para redirecionar
    });

  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY' || err.message === 'CPF_DUPLICADO') {
      return res.status(400).json({ mensagem: "CPF já cadastrado" });
    }
    console.error(err);
    return res.status(500).json({ mensagem: "Erro interno" });
  }
}

module.exports = { cadastrarUsuario };

module.exports = {
  cadastrarUsuario,
};
