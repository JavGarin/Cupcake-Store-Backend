// consultas.js
// Cupcake-Store-Backend/consultas.js 
const pool = require('../db'); // Asegúrate de que la ruta esté correcta

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
