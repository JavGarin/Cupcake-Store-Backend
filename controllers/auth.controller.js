const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_development';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';

// Función helper para generar tokens JWT
const generarToken = (usuario) => {
  return jwt.sign(
    {
      userId: usuario.user_id,
      email: usuario.email,
      role: usuario.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

/**
 * Registra un nuevo usuario
 */
const registrarUsuario = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (usuarioExistente.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = await pool.query(
      `INSERT INTO users (username, email, password) 
       VALUES ($1, $2, $3) 
       RETURNING user_id, email, username, role, created_at`,
      [username, email, hashedPassword]
    );

    // Generar token JWT
    const token = generarToken(nuevoUsuario.rows[0]);

    // Responder con éxito
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: nuevoUsuario.rows[0].user_id,
        email: nuevoUsuario.rows[0].email,
        username: nuevoUsuario.rows[0].username,
        role: nuevoUsuario.rows[0].role
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Autentica a un usuario existente
 */
const iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por email
    const usuario = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (usuario.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Comparar contraseñas
    const contraseñaValida = await bcrypt.compare(password, usuario.rows[0].password);
    
    if (!contraseñaValida) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = generarToken(usuario.rows[0]);

    // Responder con éxito
    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: usuario.rows[0].user_id,
        email: usuario.rows[0].email,
        username: usuario.rows[0].username,
        role: usuario.rows[0].role
      }
    });

  } catch (error) {
    console.error('Error en inicio de sesión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Obtiene el perfil del usuario autenticado
 */
const verPerfil = async (req, res) => {
  try {
    // El middleware verificarToken ya validó el token y adjuntó req.user
    const usuario = await pool.query(
      `SELECT user_id, email, username, role, created_at 
       FROM users 
       WHERE user_id = $1`,
      [req.user.userId]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      user: {
        id: usuario.rows[0].user_id,
        email: usuario.rows[0].email,
        username: usuario.rows[0].username,
        role: usuario.rows[0].role,
        createdAt: usuario.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el perfil',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  registrarUsuario,
  iniciarSesion,
  verPerfil
};