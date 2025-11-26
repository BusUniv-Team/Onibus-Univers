// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const loginRoutes = require("./routes/loginRoutes");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middlewares (sempre antes das rotas)
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Se serve uploads estaticamente:
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use("/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api", loginRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

