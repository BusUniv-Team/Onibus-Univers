// model e bcrypt importar depois
// const bcrypt = require("bcryptjs");
// const { criarUsuario } = require("../models/usuario");

// backend/controllers/cadastroController.js
const bcrypt = require("bcrypt");
const path = require("path");
const { criarUsuario } = require("../models/usuario");

async function cadastrarUsuario(req, res) {
  try {
    const {
      nome,
      email,
      cpf,
      semestre,
      turno,
      faculdade,
      telefone,
      curso,
      senha,
    } = req.body;

    console.log("📥 Dados recebidos do frontend (cadastro):", req.body);

    if (!nome || !email || !cpf || !senha) {
      return res.status(400).json({ mensagem: "Nome, email, CPF e senha são obrigatórios." });
    }

    // req.file vem do multer
    if (!req.file) {
      return res.status(400).json({ mensagem: "Comprovante (PDF) é obrigatório." });
    }

    // monta caminho relativo que vai pro banco (ex: uploads/16912345-Oficio.pdf)
    const comprovantePath = path.join("uploads", req.file.filename);

    // hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const dadosParaCriar = {
      nome,
      email,
      cpf,
      semestre: semestre ? Number(semestre) : null,
      turno,
      comprovante: comprovantePath, // <- string salva no DB
      faculdade,
      telefone,
      cargo: "aluno",
      curso,
      senhaHash,
    };

    // DEBUG: mostrar os valores que vamos inserir
    console.log("DEBUG -> valores para inserir:", dadosParaCriar);

    const novoId = await criarUsuario(dadosParaCriar);

    return res.status(201).json({
      mensagem: "Usuário criado com sucesso",
      id: novoId,
      comprovante: comprovantePath
    });
  } catch (error) {
    console.error("❌ Erro no cadastrarUsuario:", error);
    return res.status(500).json({ mensagem: "Erro interno ao processar cadastro." });
  }
}

module.exports = {
  cadastrarUsuario,
};
