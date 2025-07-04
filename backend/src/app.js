const express = require("express");
const app = express();
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");

// Middlewares
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);

module.exports = app;
