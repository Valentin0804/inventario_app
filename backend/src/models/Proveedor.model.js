const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Proveedor = sequelize.define(
  "Proveedor",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    direccion: { type: DataTypes.STRING(255) },
    telefono: { type: DataTypes.STRING(50) },
    email: { type: DataTypes.STRING(150) },
  },
  {
    tableName: "proveedores",
    timestamps: true,       
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

module.exports = Proveedor;
