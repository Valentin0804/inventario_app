const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const MetodoPago = sequelize.define(
  "MetodoPago",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, { 
    tableName: "metodos_pagos", timestamps: false }
);

module.exports = MetodoPago;
