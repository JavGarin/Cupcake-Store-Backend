const express = require('express');
const router = express.Router();
const { 
  obtenerProductos, 
  obtenerProducto 
} = require('../controllers/productos.controller');

router.get('/', obtenerProductos);

router.get('/:id', obtenerProducto);

module.exports = router;