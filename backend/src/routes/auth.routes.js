// src/routes/auth.routes.js
const express = require("express");
const router = express.Router();
const { register } = require("../controllers/auth.controller");

router.post("/register", register);

module.exports = router;
