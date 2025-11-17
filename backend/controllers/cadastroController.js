// model e bcrypt importar depois
// const bcrypt = require("bcryptjs");
// const { criarUsuario } = require("../models/usuario");

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

    console.log("📥 Dados recebidos do frontend (cadastro):");
    console.log({
      nome,
      email,
      cpf,
      semestre,
      turno,
      faculdade,
      telefone,
      curso,
      senha,
    });

    // validação
    if (!nome || !email || !cpf) {
      return res
        .status(400)
        .json({ mensagem: "Nome, email e CPF são obrigatórios." });
    }

    // preciso salvar isso no banco de dados depois 

    return res.status(201).json({
      mensagem: "Marcel deu CU e mandou pro backend!",
      dados: {
        nome,
        email,
        cpf,
        semestre,
        turno,
        faculdade,
        telefone,
        curso,
      },
    });
  } catch (error) {
    console.error("❌ Erro no cadastrarUsuario:", error);
    return res
      .status(500)
      .json({ mensagem: "Erro interno ao processar cadastro." });
  }
}

module.exports = {
  cadastrarUsuario,
};
