const express = require("express");
const router = express.Router();

const {
  crearQR,
  comprobarPago,
} = require("../controllers/mercadoPago.controller");

router.post("/crear-qr", crearQR);
router.get("/estado/:external_reference", comprobarPago);

module.exports = router;
