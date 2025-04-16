require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./models");

// Middlewares
app.use(express.json());

// Ruta de prueba
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Conexión y sincronización
db.sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Conexión a la base de datos exitosa.");

    return db.sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("📦 Modelos sincronizados con la base de datos.");

    // Aca arranca el servidor
    app.listen(3000, () => {
      console.log("🚀 Servidor corriendo en http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar o sincronizar la base de datos:", err);
  });
