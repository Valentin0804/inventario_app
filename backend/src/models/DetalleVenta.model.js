const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Venta = require("./Venta.model");
const Producto = require("./Producto.model");

const DetalleVenta = sequelize.define(
  "DetalleVenta",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    cantidad: { type: DataTypes.INTEGER, allowNull: false },
    precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    subtotal: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    venta_id: {
      type: DataTypes.INTEGER,
      references: { model: Venta, key: "id" },
    },
    producto_id: {
      type: DataTypes.INTEGER,
      references: { model: Producto, key: "id" },
    },
  },
  { tableName: "detalles_ventas", timestamps: false }
);

module.exports = DetalleVenta;
