const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Carga correcta de modelos ejecutando la función
db.Usuario = require("./Usuario.model.js");
db.Proveedor = require("./Proveedor.model.js");
db.MetodoPago = require("./MetodoPago.model.js");
db.Categoria = require("./Categoria.model.js");
db.Producto = require("./Producto.model.js");
db.Venta = require("./Venta.model.js");
db.DetalleVenta = require("./DetalleVenta.model.js");

// Relaciones

// Producto ↔ Proveedor
db.Producto.belongsTo(db.Proveedor, {
  foreignKey: "proveedor_id",
  as: "proveedor",
});
db.Proveedor.hasMany(db.Producto, {
  foreignKey: "proveedor_id",
  as: "productos",
});

// Producto ↔ Categoria
db.Producto.belongsTo(db.Categoria, {
  foreignKey: "categoria_id",
  as: "categoria",
});
db.Categoria.hasMany(db.Producto, {
  foreignKey: "categoria_id",
  as: "productos",
});

// Venta ↔ Método pago
db.Venta.belongsTo(db.MetodoPago, {
  foreignKey: "metodopago_id",
  as: "metodoPago",
});
db.MetodoPago.hasMany(db.Venta, { foreignKey: "metodopago_id", as: "ventas" });

// Venta ↔ Usuario
db.Venta.belongsTo(db.Usuario, { foreignKey: "usuario_id", as: "usuario" });
db.Usuario.hasMany(db.Venta, { foreignKey: "usuario_id", as: "ventas" });

// Venta ↔ Detalle venta
db.Venta.hasMany(db.DetalleVenta, {
  foreignKey: "venta_id",
  as: "detalleVenta",
});
db.DetalleVenta.belongsTo(db.Venta, { foreignKey: "venta_id", as: "venta" });

// Producto ↔ Detalle venta
db.Producto.hasMany(db.DetalleVenta, {
  foreignKey: "producto_id",
  as: "detalleVenta",
});
db.DetalleVenta.belongsTo(db.Producto, {
  foreignKey: "producto_id",
  as: "producto",
});

// Producto ↔ Usuario (quién lo cargó)
db.Producto.belongsTo(db.Usuario, { foreignKey: "usuario_id", as: "usuario" });
db.Usuario.hasMany(db.Producto, { foreignKey: "usuario_id", as: "productos" });

module.exports = db;
