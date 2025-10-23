import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import cadastroRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.resolve("uploads"))); // rotas pdf
app.use("/api/cadastro", cadastroRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando ");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

