const express = require("express");
const router = express.Router();
const VentaController = require("../controllers/venta.controller");
const { verifyToken } = require("../middlewares/auth.middleware");

router.post("/", verifyToken, VentaController.createVenta);
router.delete("/:id", verifyToken, VentaController.deleteVenta);
router.put("/:id", verifyToken, VentaController.updateVenta);
router.get("/", verifyToken, VentaController.getVentas);
router.get("/:id", verifyToken, VentaController.getVentaById);

router.get("/filtros/vendedores", verifyToken, VentaController.getVendedores);
router.get("/filtros/metodos-pago", verifyToken, VentaController.getMetodosPago);


module.exports = router;
