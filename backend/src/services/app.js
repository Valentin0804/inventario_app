const express = require("express");
const app = express();

require("dotenv").config();

const authRoutes = require("../routes/auth.routes");
const dashboardRoutes = require("../routes/dashboard.routes");

// Middlewares
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
