const express = require("express");
const router = express.Router();
const { verifyToken, isDueno } = require("../middlewares/auth.middleware");
const metodoPagoController = require("../controllers/metodopago.controller");

router.post("/", verifyToken, isDueno, metodoPagoController.createMetodoPago);
router.get("/", verifyToken,  metodoPagoController.getMetodosPago);
router.get("/:id", verifyToken, isDueno, metodoPagoController.getMetodoPagoById);
router.put("/:id", verifyToken, isDueno, metodoPagoController.updateMetodoPago);
router.delete("/:id", verifyToken, isDueno, metodoPagoController.deleteMetodoPago);

module.exports = router;
