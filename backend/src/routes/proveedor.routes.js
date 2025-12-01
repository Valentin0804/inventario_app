const express = require("express");
const router = express.Router();
const ProveedorController = require("../controllers/proveedor.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/", verifyToken, ProveedorController.crearProveedor);
router.get("/", verifyToken, ProveedorController.listarProveedores);
router.delete("/:id", verifyToken, ProveedorController.deleteProveedor);
router.get("/:id", verifyToken, ProveedorController.obtenerProveedor);
router.put("/:id", verifyToken, ProveedorController.actualizarProveedor);

module.exports = router;
