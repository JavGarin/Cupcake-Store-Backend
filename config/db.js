require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Manejo mejorado de conexiones
pool.on('connect', () => console.log('✅ Conexión a PostgreSQL establecida'));
pool.on('error', (err) => {
  console.error('❌ Error en la conexión:', err);
  process.exit(-1);
});

// Test de conexión al iniciar
(async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL conectado correctamente');
  } catch (err) {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    process.exit(1);
  }
})();

module.exports = pool;