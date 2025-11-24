// Categoria.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Categoria = sequelize.define(
  "Categoria",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    descripcion: { type: DataTypes.STRING(255) },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true } // Borrado lógico
  },
  { tableName: "categorias", timestamps: false }
);

module.exports = Categoria;
