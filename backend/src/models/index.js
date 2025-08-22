const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

// Se cargan los modelos
const Producto = require("./Producto.model")(sequelize, DataTypes);
const Venta = require("./Venta.model")(sequelize, DataTypes);
const DetalleVenta = require("./DetalleVenta.model")(sequelize, DataTypes);
const Usuario = require("./Usuario.model")(sequelize, DataTypes); 


// Se crea el objeto db con los modelos
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Producto = Producto;
db.Venta = Venta;
db.DetalleVenta = DetalleVenta;
db.Usuario = Usuario;

// Relaciones
db.Usuario.hasMany(db.Producto, { foreignKey: 'usuarioId' });
db.Producto.belongsTo(db.Usuario, { foreignKey: 'usuarioId' });

db.Usuario.hasMany(db.Venta, { foreignKey: 'usuarioId' });
db.Venta.belongsTo(db.Usuario, { foreignKey: 'usuarioId' });

db.Venta.hasMany(db.DetalleVenta, { foreignKey: "ventaId" });
db.DetalleVenta.belongsTo(db.Venta, { foreignKey: "ventaId" });

db.Producto.hasMany(db.DetalleVenta, { foreignKey: "productoId" });
db.DetalleVenta.belongsTo(db.Producto, { foreignKey: "productoId" });

module.exports = db;
