module.exports = (sequelize, DataTypes) => {
    const DetalleVenta = sequelize.define("DetalleVenta", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  
    return DetalleVenta;
  };
  