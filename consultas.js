const { Pool } = require('pg');

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/**
 * Obtiene todos los cupcakes de la base de datos
 * @returns {Promise<Array>}
 */
const obtenerTodosLosCupcakes = async () => {
  try {
    const result = await pool.query(`
      SELECT 
        cupcake_id as id,
        name,
        description,
        price,
        image_url as image,
        stock,
        rating,
        bg_color as bgColor
      FROM cupcakes
    `);
    return result.rows;
  } catch (error) {
    console.error('Error en obtenerTodosLosCupcakes:', error);
    throw error;
  }
};

/**
 * Obtiene un cupcake por su ID
 * @param {number} id - ID del cupcake
 * @returns {Promise<Object>} Datos del cupcake
 */
const obtenerCupcakePorId = async (id) => {
  try {
    const result = await pool.query(`
      SELECT 
        cupcake_id as id,
        name,
        description,
        price,
        image_url as image,
        stock,
        rating,
        bg_color as bgColor
      FROM cupcakes 
      WHERE cupcake_id = $1
    `, [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error en obtenerCupcakePorId:', error);
    throw error;
  }
};

module.exports = {
  obtenerTodosLosCupcakes,
  obtenerCupcakePorId
};