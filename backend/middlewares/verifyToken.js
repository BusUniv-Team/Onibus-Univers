// middlewares/verifyToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) return res.status(401).json({ mensagem: 'Token ausente' });

  // header esperado: "Bearer <token>"
  const parts = authHeader.split(' ');
  if (parts.length !== 2) return res.status(401).json({ mensagem: 'Token mal formatado' });

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ mensagem: 'Token inválido' });
    req.user = decoded; // { id, cpf, cargo }
    next();
  });
}

module.exports = verifyToken;
