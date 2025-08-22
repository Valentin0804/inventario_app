module.exports = (sequelize, DataTypes) => {
    const Producto = sequelize.define("Producto", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.STRING,
      },
      precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
  
    return Producto;
  };
  