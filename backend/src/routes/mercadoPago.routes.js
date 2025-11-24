const express = require("express");
const router = express.Router();

const { crearQR, estadoPago } = require("../controllers/mercadoPago.controller");

// Crear QR
router.post("/crear-qr", crearQR);


module.exports = router;
