const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1] || 
                req.cookies?.token;

  if (!token) {
    return res.status(403).json({ 
      success: false,
      message: 'Token no proporcionado' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    
    const message = error.name === 'TokenExpiredError' 
      ? 'Token expirado' 
      : 'Token inválido';

    return res.status(401).json({ 
      success: false,
      message 
    });
  }
};

module.exports = verificarToken;