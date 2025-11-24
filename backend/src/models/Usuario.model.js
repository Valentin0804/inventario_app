const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Usuario = sequelize.define("Usuario", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
  nombre: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true,allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  rol: { 
    type: DataTypes.ENUM('admin', 'vendedor'), 
    defaultValue: 'vendedor' 
  },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: "usuarios",
  timestamps: false,
});

module.exports = Usuario;
