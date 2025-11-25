const express = require("express");
const router = express.Router();
const ProveedorController = require("../controllers/proveedor.controller");

router.post("/", ProveedorController.crearProveedor);
router.get("/", ProveedorController.listarProveedores);
router.delete("/:id", ProveedorController.deleteProveedor);
router.get("/:id", ProveedorController.obtenerProveedor);
router.put("/:id", ProveedorController.actualizarProveedor);

module.exports = router;
