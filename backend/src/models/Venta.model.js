module.exports = (sequelize, DataTypes) => {
    const Venta = sequelize.define("Venta", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fecha: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      total: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
    });
  
    return Venta;
  };
  