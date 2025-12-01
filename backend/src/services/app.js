const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
// Middlewares
app.use(express.json());

// CORS SIEMPRE ANTES DE LAS RUTAS
app.use(cors({
  origin: "http://localhost:4200",
  methods: "GET,POST,PUT,DELETE",
  credentials: true
}));

const { verifyToken } = require("../middlewares/auth.middleware");

// Rutas públicas
const authRoutes = require("../routes/auth.routes");
app.use("/api/auth", authRoutes);

const mpWebhookRoutes = require("../routes/mp.webhook");
app.use("/webhook", mpWebhookRoutes);

// Rutas privadas
const dashboardRoutes = require("../routes/dashboard.routes");
const categoriaRoutes = require("../routes/categoria.routes");
const metodoPagoRoutes = require("../routes/metodopago.routes");
const productoRoutes = require("../routes/producto.routes");
const proveedorRoutes = require("../routes/proveedor.routes");
const ventaRoutes = require("../routes/venta.routes");
const mercadoPagoRoutes = require("../routes/mercadoPago.routes");
const usuarioRoutes = require("../routes/usuario.routes");

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/metodospago", metodoPagoRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/ventas", ventaRoutes);
app.use("/api/mercadopago", mercadoPagoRoutes);
app.use("/api/usuarios", usuarioRoutes);

module.exports = app;
