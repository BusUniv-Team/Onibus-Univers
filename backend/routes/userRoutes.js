const express = require("express");
const router = express.Router();
const { cadastrarUsuario } = require("../controllers/cadastroController");

router.post("/cadastrar", cadastrarUsuario);

module.exports = router;

