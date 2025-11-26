// backend/routes/userRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const { cadastrarUsuario } = require("../controllers/cadastroController");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve("uploads")),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"))
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") return cb(new Error("Apenas PDFs são aceitos"));
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 } // limite 10MB, ajuste se precisar
});

router.post("/cadastrar", upload.single("comprovante"), cadastrarUsuario);

module.exports = router;
