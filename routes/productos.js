const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    // Consulta base
    let query = `
      SELECT 
        cupcake_id AS id,
        name,
        description,
        price,
        image_url AS image,
        stock
      FROM cupcakes
    `;

    const params = [];
    
    // Filtro de búsqueda
    if (search) {
      query += ` WHERE name ILIKE $1 OR description ILIKE $1`;
      params.push(`%${search}%`);
    }

    // Orden y paginación (sin duplicar ORDER BY)
    query += `
      ORDER BY name
      LIMIT $${params.length + 1}
      OFFSET $${params.length + 2}
    `;
    params.push(parseInt(limit), offset);

    // Ejecutar consulta
    const { rows } = await pool.query(query, params);

    // Obtener conteo total
    const countQuery = search 
      ? `SELECT COUNT(*) FROM cupcakes WHERE name ILIKE $1 OR description ILIKE $1`
      : `SELECT COUNT(*) FROM cupcakes`;
    
    const countResult = await pool.query(
      search ? countQuery : countQuery, 
      search ? [`%${search}%`] : []
    );
    const total = parseInt(countResult.rows[0].count);

    res.status(200).json({
      success: true,
      count: rows.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
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
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'ID de producto no válido'
    });
  }

  try {
    const { rows } = await pool.query(
      `
  SELECT 
    cupcake_id AS id,
    name,
    description,
    price,
    image_url AS image,  -- Asegúrate que este alias coincide con lo que espera el frontend
    stock
  FROM cupcakes
  ORDER BY name
`,
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
});

module.exports = router;