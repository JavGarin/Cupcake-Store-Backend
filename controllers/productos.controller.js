const pool = require('../db');

// Constantes para mensajes de error
const ERROR_MESSAGES = {
  PRODUCT_NOT_FOUND: 'Producto no encontrado',
  FETCH_PRODUCTS_ERROR: 'Error al obtener los productos',
  FETCH_PRODUCT_ERROR: 'Error al obtener el producto'
};

/**
 * Controlador para obtener todos los productos
 */
const obtenerProductos = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        cupcake_id as id,
        name,
        description,
        price,
        image_url as image,
        stock
      FROM cupcakes
    `);
    
    if (!rows || rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron productos'
      });
    }

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error en obtenerProductos:', error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.FETCH_PRODUCTS_ERROR,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Controlador para obtener un producto por ID
 */
const obtenerProducto = async (req, res) => {
  const { id } = req.params;
  
  if (!id || isNaN(Number(id))) {
    return res.status(400).json({
      success: false,
      message: 'ID de producto no válido'
    });
  }

  try {
    const { rows } = await pool.query(`
      SELECT 
        cupcake_id as id,
        name,
        description,
        price,
        image_url as image,
        stock
      FROM cupcakes 
      WHERE cupcake_id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.PRODUCT_NOT_FOUND
      });
    }
    
    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error(`Error en obtenerProducto (ID: ${id}):`, error);
    res.status(500).json({
      success: false,
      message: ERROR_MESSAGES.FETCH_PRODUCT_ERROR,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto
};