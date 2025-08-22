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
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuarios', // Nombre de la tabla referenciada
          key: 'id' // Clave primaria de la tabla referenciada
        }
      },
    });
  
    return Venta;
  };
  