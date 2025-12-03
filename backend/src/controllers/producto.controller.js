const db = require("../models");
const Producto = db.Producto;
const sequelize = require("../config/db");

// Función para calcular precio final
const calcularPrecioFinal = (neto, porcentaje) => {
  const costo = parseFloat(neto);
  const ganancia = parseFloat(porcentaje);
  return costo + costo * (ganancia / 100);
};

const createProducto = async (req, res) => {
  try {
    const {
      codigo_barras,
      nombre,
      marca,
      precio_neto,
      porcentaje_ganancia,
      descripcion,
      stock,
      alarma_stock,
      categoria_id,
      proveedor_id,
    } = req.body;

    // Procesar la Imagen (Si se subió alguna)
    let imagen_url = null;

    if (req.file) {
      // Construye la URL.
      imagen_url = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }
    // Valida
    if (
      !nombre ||
      !precio_neto ||
      !porcentaje_ganancia ||
      stock === undefined
    ) {
      return res.status(400).json({
        message: "Faltan datos requeridos (nombre, precio, porcentaje, stock).",
      });
    }

    // Calcula Precio Final
    const neto = parseFloat(precio_neto);
    const porcentaje = parseFloat(porcentaje_ganancia);
    const precio_final = calcularPrecioFinal(neto, porcentaje);

    // Crea producto con la URL de la imagen
    const newProducto = await Producto.create({
      codigo_barras,
      nombre,
      marca,
      precio_neto: neto,
      porcentaje_ganancia: porcentaje,
      precio_final,
      descripcion,
      stock: parseInt(stock), 
      alarma_stock: alarma_stock ? parseInt(alarma_stock) : null,
      categoria_id: categoria_id ? parseInt(categoria_id) : null,
      proveedor_id: proveedor_id ? parseInt(proveedor_id) : null,
      usuario_id: req.userId,
      imagen_url: imagen_url, 
    });

    res.status(201).json(newProducto);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

const getAllProductos = async (req, res) => {
  try {
    const productos = await Producto.findAll();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

const updateProducto = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    // Datos de texto
    const {
      nombre,
      marca,
      precio_neto,
      porcentaje_ganancia,
      stock,
      descripcion,
      alarma_stock,
      categoria_id,
      proveedor_id,
    } = req.body;

    // Verifica si el producto existe
    const producto = await Producto.findByPk(id);
    if (!producto) {
      await t.rollback();
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Preparar objeto de actualización
    const datosActualizar = {};

    // Agregamos campos solo si vienen en la petición
    if (nombre) datosActualizar.nombre = nombre;
    if (marca) datosActualizar.marca = marca;
    if (descripcion) datosActualizar.descripcion = descripcion;
    if (stock !== undefined) datosActualizar.stock = parseInt(stock);
    if (alarma_stock) datosActualizar.alarma_stock = parseInt(alarma_stock);
    if (categoria_id) datosActualizar.categoria_id = parseInt(categoria_id);
    if (proveedor_id) datosActualizar.proveedor_id = parseInt(proveedor_id);

    // Recalcular precio si cambiaron valores monetarios
    if (precio_neto || porcentaje_ganancia) {
      const pNeto = precio_neto
        ? parseFloat(precio_neto)
        : parseFloat(producto.precio_neto);
      const pGanancia = porcentaje_ganancia
        ? parseFloat(porcentaje_ganancia)
        : parseFloat(producto.porcentaje_ganancia);

      datosActualizar.precio_neto = pNeto;
      datosActualizar.porcentaje_ganancia = pGanancia;
      datosActualizar.precio_final = calcularPrecioFinal(pNeto, pGanancia);
    }

    // Logica de imagen
    if (req.file) {
      // Actualizamos URL
      datosActualizar.imagen_url = `${req.protocol}://${req.get(
        "host"
      )}/uploads/${req.file.filename}`;
    }

    // Ejecuta la act
    await producto.update(datosActualizar, { transaction: t });
    await t.commit();

    res.json({ message: "Producto actualizado", producto });
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    await producto.destroy();
    res.status(200).json({ message: "Producto eliminado con éxito." });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json({ message: "Error del servidor." });
  }
};

module.exports = {
  createProducto,
  getAllProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
};
