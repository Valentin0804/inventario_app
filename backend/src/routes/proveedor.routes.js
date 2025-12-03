const express = require("express");
const router = express.Router();
const ProveedorController = require("../controllers/proveedor.controller");
const { verifyToken, isDueno } = require("../middlewares/auth.middleware");

router.post("/", verifyToken, isDueno, ProveedorController.crearProveedor);
router.get("/", verifyToken, isDueno, ProveedorController.listarProveedores);
router.delete("/:id", verifyToken, isDueno, ProveedorController.deleteProveedor);
router.get("/:id", verifyToken, isDueno, ProveedorController.obtenerProveedor);
router.put("/:id", verifyToken, isDueno, ProveedorController.actualizarProveedor);

module.exports = router;
