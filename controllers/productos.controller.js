const pool = require('../config/db');

const obtenerProductos = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT 
        cupcake_id AS id,
        name,
        description,
        price,
        image_url AS image,
        stock
       FROM cupcakes
       ORDER BY name`
    );

    res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los productos',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const obtenerProducto = async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID de producto no válido'
    });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        cupcake_id AS id,
        name,
        description,
        price,
        image_url AS image,
        stock
       FROM cupcakes
       WHERE cupcake_id = $1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error(`Error al obtener producto (ID: ${id}):`, error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el producto',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  obtenerProductos,
  obtenerProducto
};