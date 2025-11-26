const db = require("../models");
const Producto = db.Producto;

// Función para calcular precio final
const calcularPrecioFinal = (neto, porcentaje) => {
  const costo = parseFloat(neto);
  const ganancia = parseFloat(porcentaje);
  return costo + (costo * (ganancia / 100));
};

const createProducto = async (req, res) => {
  try {
    //Obtener datos
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
      proveedor_id 
    } = req.body;

    // Validar campos obligatorios del Modelo
    if (!nombre || !precio_neto || !porcentaje_ganancia || stock === undefined) {
      return res.status(400).json({ message: "Faltan datos requeridos (nombre, precio_neto, porcentaje, stock)." });
    }

    // Calcular Precio Final automáticamente
    const precio_final = calcularPrecioFinal(precio_neto, porcentaje_ganancia);

    //Crear el producto
    const newProducto = await Producto.create({
        codigo_barras,
        nombre,
        marca,
        precio_neto,
        porcentaje_ganancia,
        precio_final,
        descripcion,
        stock,
        alarma_stock,
        categoria_id,
        proveedor_id,
        usuario_id: req.userId
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
  try {
    const { id } = req.params;
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
      proveedor_id 
    } = req.body;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado." });
    }

    // Si cambian el precio o la ganancia, se recalcula el precio final
    let nuevoPrecioFinal = producto.precio_final;
    
    const costoAUsar = precio_neto !== undefined ? precio_neto : producto.precio_neto;
    const gananciaAUsar = porcentaje_ganancia !== undefined ? porcentaje_ganancia : producto.porcentaje_ganancia;

    nuevoPrecioFinal = calcularPrecioFinal(costoAUsar, gananciaAUsar);

    await producto.update({
        codigo_barras: codigo_barras || producto.codigo_barras,
        nombre: nombre || producto.nombre,
        marca: marca || producto.marca,
        precio_neto: precio_neto || producto.precio_neto,
        porcentaje_ganancia: porcentaje_ganancia || producto.porcentaje_ganancia,
        precio_final: nuevoPrecioFinal,
        descripcion: descripcion || producto.descripcion,
        stock: (stock !== undefined) ? stock : producto.stock,
        alarma_stock: (alarma_stock !== undefined) ? alarma_stock : producto.alarma_stock,
        categoria_id: categoria_id || producto.categoria_id,
        proveedor_id: proveedor_id || producto.proveedor_id,
    });

    res.status(200).json({
      message: "Producto actualizado con éxito.",
      producto
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error del servidor." });
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