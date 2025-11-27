const jwt = require("jsonwebtoken");
const { buscarUsuarioPorCPF } = require("../models/usuario");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    try {
        const { cpf, senha } = req.body;

        const usuario = await buscarUsuarioPorCPF(cpf);

        if (!usuario) {
            return res.status(400).json({ error: "Usuário não encontrado" });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ error: "Senha incorreta" });
        }

        const token = jwt.sign(
            { id: usuario.id, cpf: usuario.cpf, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login realizado com sucesso",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                cpf: usuario.cpf
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno no servidor" });
    }
};

module.exports = { login };
