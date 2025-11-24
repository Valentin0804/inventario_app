const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Producto = sequelize.define("Producto", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    codigo_barras: { type: DataTypes.STRING(50), unique: true },
    nombre: { type: DataTypes.STRING(255), allowNull: false },
    marca: { type: DataTypes.STRING(255) },
    precio_neto: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    porcentaje_ganancia: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    precio_final: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    descripcion: { type: DataTypes.TEXT },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    alarma_stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    categoria_id: { type: DataTypes.INTEGER },
    proveedor_id: { type: DataTypes.INTEGER },
    usuario_id: { type: DataTypes.INTEGER }
  }, {
    tableName: "productos",
    timestamps: false,
  }
);

module.exports = Producto;
