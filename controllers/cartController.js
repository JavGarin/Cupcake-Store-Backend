const pool = require("../config/db");

const obtenerCarrito = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.cart_id, c.user_id, c.cupcake_id, p.name, p.price, p.image_url, c.quantity 
       FROM cart c
       JOIN cupcakes p ON c.cupcake_id = p.cupcake_id
       WHERE c.user_id = $1`,
      [req.user.userId]
    );

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener el carrito",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const agregarAlCarrito = async (req, res) => {
  try {
    const { cupcake_id, quantity } = req.body;

    // Validación
    if (!cupcake_id || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Datos de producto inválidos",
      });
    }

    // Verificar existencia del producto
    const producto = await pool.query(
      "SELECT cupcake_id FROM cupcakes WHERE cupcake_id = $1",
      [cupcake_id]
    );

    if (producto.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado",
      });
    }

    // Verificar si ya está en el carrito
    const itemExistente = await pool.query(
      "SELECT * FROM cart WHERE user_id = $1 AND cupcake_id = $2",
      [req.user.userId, cupcake_id]
    );

    if (itemExistente.rows.length > 0) {
      // Actualizar cantidad
      await pool.query(
        "UPDATE cart SET quantity = quantity + $1 WHERE user_id = $2 AND cupcake_id = $3",
        [quantity, req.user.userId, cupcake_id]
      );
    } else {
      // Añadir nuevo item
      await pool.query(
        "INSERT INTO cart (user_id, cupcake_id, quantity) VALUES ($1, $2, $3)",
        [req.user.userId, cupcake_id, quantity]
      );
    }

    res.json({
      success: true,
      message: "Producto añadido al carrito",
    });
  } catch (error) {
    console.error("Error al añadir al carrito:", error);
    res.status(500).json({
      success: false,
      message: "Error al añadir al carrito",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const actualizarCantidadCarrito = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Cantidad inválida",
      });
    }

    const resultado = await pool.query(
      "UPDATE cart SET quantity = $1 WHERE user_id = $2 AND cupcake_id = $3 RETURNING *",
      [quantity, req.user.userId, id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado en el carrito",
      });
    }

    res.json({
      success: true,
      message: "Cantidad actualizada",
    });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar la cantidad",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const eliminarDelCarrito = async (req, res) => {
  try {
    const { id } = req.params;

    const { rowCount } = await pool.query(
      "DELETE FROM cart WHERE user_id = $1 AND cupcake_id = $2 RETURNING *",
      [req.user.userId, id]
    );

    if (rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Producto no encontrado en el carrito",
      });
    }

    res.json({
      success: true,
      message: "Producto eliminado del carrito",
    });
  } catch (error) {
    console.error("Error al eliminar del carrito:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar del carrito",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const limpiarCarrito = async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM cart WHERE user_id = $1 RETURNING *",
      [req.user.userId]
    );

    res.json({
      success: true,
      message: rowCount > 0 
        ? "Carrito limpiado correctamente" 
        : "El carrito ya estaba vacío",
    });
  } catch (error) {
    console.error("Error al limpiar carrito:", error);
    res.status(500).json({
      success: false,
      message: "Error al limpiar el carrito",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidadCarrito,
  eliminarDelCarrito,
  limpiarCarrito,
};