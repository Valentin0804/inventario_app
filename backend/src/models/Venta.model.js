const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Usuario = require("./Usuario.model");

const Venta = sequelize.define(
  "Venta",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    total_venta: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    usuario_id: { type: DataTypes.INTEGER },
    metodopago_id: { type: DataTypes.INTEGER },
  },
  {
    tableName: "ventas",
    timestamps: false,
  }
);

module.exports = Venta;
