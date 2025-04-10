require('dotenv').config();
const { Pool } = require('pg');

// Configuración detallada de la conexión
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Verificación de conexión mejorada
pool.on('connect', () => {
  console.log('✅ Conexión a PostgreSQL establecida');
});

pool.on('error', (err) => {
  console.error('❌ Error inesperado en la conexión a PostgreSQL:', err);
  process.exit(-1);
});

// Función para probar la conexión al inicio
const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL verificada');
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    process.exit(1);
  }
};

testConnection();

module.exports = pool;