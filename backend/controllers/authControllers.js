// backend/controllers/authController.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

function normalizeCpf(cpf) {
  return String(cpf || '').replace(/[^\d]/g, '');
}

async function login(req, res) {
  try {
    const { cpf, senha } = req.body;
    if (!cpf || !senha) return res.status(400).json({ mensagem: 'CPF e senha obrigatórios' });

    const cpfNorm = normalizeCpf(cpf);

    const [rows] = await pool.execute(
      `SELECT id_us AS id, Nome AS nome, Email, CPF, Cargos AS cargo, senha 
       FROM usuario 
       WHERE REPLACE(REPLACE(REPLACE(CPF, '.', ''), '-', ''), ' ', '') = ?`,
      [cpfNorm]
    );

    if (rows.length === 0) return res.status(401).json({ mensagem: 'CPF ou senha inválidos' });

    const user = rows[0];
    const match = await bcrypt.compare(senha, user.senha);
    if (!match) return res.status(401).json({ mensagem: 'CPF ou senha inválidos' });

    const payload = { id: user.id, cpf: cpfNorm, cargo: user.cargo };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'trocar_essa_chave', { expiresIn: process.env.JWT_EXPIRES_IN || '8h' });

    return res.json({
      mensagem: 'Autenticado com sucesso',
      token,
      usuario: { id: user.id, nome: user.nome, email: user.Email, cargo: user.cargo }
    });
  } catch (err) {
    console.error('Erro login:', err && (err.stack || err));
    return res.status(500).json({ mensagem: 'Erro interno' });
  }
}

module.exports = { login };
