const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verificarToken = require('../middlewares/verifyToken');

router.use(verificarToken);

router.get("/", cartController.obtenerCarrito);
router.post("/", cartController.agregarAlCarrito);
router.put("/:id", cartController.actualizarCantidadCarrito);
router.delete("/:id", cartController.eliminarDelCarrito);
router.delete("/", cartController.limpiarCarrito);

module.exports = router;