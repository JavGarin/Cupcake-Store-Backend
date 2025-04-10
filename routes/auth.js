// Cupcake-Store-Backend/routes/auth.js
const express = require('express');
const router = express.Router();
const { 
  registrarUsuario, 
  iniciarSesion, 
  verPerfil 
} = require('../controllers/auth.controller');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rutas de autenticación
router.post('/register', registrarUsuario);
router.post('/login', iniciarSesion);
router.get('/profile', verificarToken, verPerfil);

module.exports = router;