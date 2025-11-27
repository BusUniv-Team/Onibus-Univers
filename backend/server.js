// backend/server.js
const express = require("express");
const cors = require("cors");
const path = require("path"); 
require("dotenv").config();

const loginRoutes = require("./routes/loginRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require('./routes/authRoutes');
const viagensRoutes = require('./routes/viagensRoutes'); 
const dashboardRoutes = require('./routes/dashboardRoutes'); 

const app = express();

// Middlewares
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Definição das Rotas
app.use("/auth", authRoutes);
app.use("/api/usuarios", userRoutes);
app.use("/api", loginRoutes);
app.use("/api/dashboard", dashboardRoutes);

// http://localhost:3001/api/enquete/votar
app.use("/api", viagensRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});