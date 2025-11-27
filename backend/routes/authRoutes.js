// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authControllers'); // caminho relativo para ../controllers/authController.js

router.post('/login', login);

module.exports = router;
