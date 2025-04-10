// Cupcake-Store-Backend/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_development';

const verificarToken = (req, res, next) => {
  // Obtener el token de los headers
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <token>

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Token de autenticación requerido' 
    });
  }

  // Verificar el token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Error al verificar token:', err);
      return res.status(403).json({ 
        success: false,
        error: 'Token inválido o expirado' 
      });
    }
    
    // Token válido, adjuntar datos del usuario al request
    req.user = user;
    next();
  });
};

module.exports = {
  verificarToken
};