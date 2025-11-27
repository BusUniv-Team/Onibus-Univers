// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path"); // Declarado apenas uma vez aqui no topo
require("dotenv").config();

// Importação das rotas
const loginRoutes = require("./routes/loginRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require('./routes/authRoutes');
const viagensRoutes = require('./routes/viagensRoutes'); // Arquivo novo das enquetes

const app = express();

// Middlewares (Configurações de segurança e leitura de dados)
app.use(cors()); // Libera o acesso para o Frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de arquivos estáticos (Uploads)
// Usa a variável 'path' declarada lá em cima, sem redeclarar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definição das Rotas
app.use("/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api", loginRoutes);

// Rotas de Viagens (Enquete e Dashboard)
// Como no viagensRoutes definimos '/enquete/votar', ao usar '/api' aqui,
// a URL final fica: http://localhost:3001/api/enquete/votar
app.use("/api", viagensRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
