const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const verificarToken = require('../middlewares/verifyToken');

router.post('/register', authController.registrarUsuario);
router.post('/login', authController.iniciarSesion);
router.get('/profile', verificarToken, authController.verPerfil);

module.exports = router;