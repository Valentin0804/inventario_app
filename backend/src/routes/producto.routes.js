const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const productoController = require("../controllers/producto.controller");

// Rutas protegidas con JWT
router.post("/", verifyToken, productoController.createProducto);
router.get("/", verifyToken, productoController.getAllProductos);
router.get("/:id", verifyToken, productoController.getProductoById);
router.put("/:id", verifyToken, productoController.updateProducto);
router.delete("/:id", verifyToken, productoController.deleteProducto);

module.exports = router;
