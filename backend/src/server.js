const app = require('./services/app');
const db = require('./models'); 
const PORT = process.env.PORT || 3000;

db.sequelize.sync({ force: false }).then(() => {
  console.log("Base de datos sincronizada.");
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}.`);
    console.log(`Accede en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("No se pudo conectar a la base de datos:", err);
});
