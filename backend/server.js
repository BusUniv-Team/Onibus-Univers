import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import cadastroRoutes from "./routes/authRoutes.js";

dotenv.config();

process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION', err);
  process.exit(1);
});
process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION', err);
});

const app = express();

const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));
app.use("/api/cadastro", cadastroRoutes);

app.get("/", (req, res) => res.json({ message: "Servidor funcionando" }));

app.use((req, res) => res.status(404).json({ message: "Rota não encontrada" }));

app.use((err, req, res, next) => {
  console.error('Erro global:', err && (err.stack || err.message || err));
  if (err && (err.name === "MulterError" || err.code === "LIMIT_FILE_SIZE")) {
    return res.status(400).json({ message: err.message || "Erro no upload" });
  }
  if (err && err.message) return res.status(400).json({ message: err.message });
  return res.status(500).json({ message: "Erro interno do servidor" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

