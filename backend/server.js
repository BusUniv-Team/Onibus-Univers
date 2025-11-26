// backend/server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const userRoutes = require("./routes/userRoutes");

const authRoutes = require('./routes/authRoutes');
const app = express();
app.use('/auth', authRoutes);




app.use(express.json());


app.use(cors());

// Rotas de usuários
app.use("/api/usuarios", userRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
