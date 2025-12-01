const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const metodoPagoController = require("../controllers/metodopago.controller");

router.post("/", verifyToken, metodoPagoController.createMetodoPago);
router.get("/", verifyToken, metodoPagoController.getMetodosPago);
router.get("/:id", verifyToken, metodoPagoController.getMetodoPagoById);
router.put("/:id", verifyToken, metodoPagoController.updateMetodoPago);
router.delete("/:id", verifyToken, metodoPagoController.deleteMetodoPago);s

module.exports = router;
