const {
  sequelize,
  Venta,
  DetalleVenta,
  Producto,
  Usuario,
  MetodoPago,
} = require("../models");
const bcrypt = require("bcryptjs");

const createVenta = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { metodopago_id, items, usuario_id } = req.body;

    if (!items || items.length === 0) {
      await t.rollback();
      return res.status(400).json({ message: "No hay productos para vender." });
    }

    let totalAcumulado = 0;
    const detallesParaGuardar = [];

    //Valida stock y calcula subtotal de cada producto
    for (const item of items) {
      const productoDb = await Producto.findByPk(item.producto_id, {
        transaction: t,
      });

      if (!productoDb) {
        throw new Error(`El producto con ID ${item.producto_id} no existe.`);
      }

      if (productoDb.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para: ${productoDb.nombre}. Quedan: ${productoDb.stock}`
        );
      }

      // Precio del producto al momento de la venta
      const precioUnitario = parseFloat(productoDb.precio_final);
      const subtotal = precioUnitario * item.cantidad;

      totalAcumulado += subtotal;

      // Objeto DetalleVenta
      detallesParaGuardar.push({
        producto_id: productoDb.id,
        cantidad: item.cantidad,
        precio_unitario: precioUnitario,
        subtotal: subtotal,
        // Despues se agrega venta_id
      });

      // Descuento de stock
      await productoDb.decrement("stock", {
        by: item.cantidad,
        transaction: t,
      });
    }
    const nuevaVenta = await Venta.create(
      {
        usuario_id: usuario_id,
        metodopago_id: metodopago_id,
        total_venta: totalAcumulado,
        fecha: new Date(),
      },
      { transaction: t }
    );

    // Se unen Detalles y Ventas
    const detallesConId = detallesParaGuardar.map((detalle) => ({
      ...detalle,
      venta_id: nuevaVenta.id,
    }));

    await DetalleVenta.bulkCreate(detallesConId, { transaction: t });

    await t.commit();

    res
      .status(201)
      .json({ message: "Venta registrada con éxito", venta_id: nuevaVenta.id });
  } catch (error) {
    await t.rollback();
    console.error("Error en transacción de venta:", error);
    res
      .status(400)
      .json({ message: error.message || "Error al procesar la venta" });
  }
};

const listarVentas = async (req, res) => {
  try {
    const ventas = await Venta.findAll();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las ventas", error });
  }
};

const deleteVenta = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { password } = req.body;
    const userId = req.userId;

    const usuario = await Usuario.findByPk(userId);
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      await t.rollback();
      return res
        .status(401)
        .json({ message: "Contraseña incorrecta. No autorizado." });
    }

    const venta = await Venta.findByPk(id, {
      include: [{ model: DetalleVenta, as: "detalleVenta" }],
    });

    if (!venta) {
      await t.rollback();
      return res.status(404).json({ message: "Venta no encontrada." });
    }

    for (const detalle of venta.detalleVenta) {
      const producto = await Producto.findByPk(detalle.producto_id, {
        transaction: t,
      });
      if (producto) {
        await producto.increment("stock", {
          by: detalle.cantidad,
          transaction: t,
        });
      }
    }

    await DetalleVenta.destroy({ where: { venta_id: id }, transaction: t });
    await Venta.destroy({ where: { id }, transaction: t });

    await t.commit();
    res.status(200).json({ message: "Venta eliminada y stock restaurado." });
  } catch (error) {
    await t.rollback();
    console.error("Error al eliminar venta:", error);
    res.status(500).json({ message: error.message || "Error del servidor" });
  }
};

const updateVenta = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { password, items, metodopago_id } = req.body;
    const userId = req.userId;

    const usuario = await Usuario.findByPk(userId);
    if (!(await bcrypt.compare(password, usuario.password))) {
      await t.rollback();
      return res.status(401).json({ message: "Contraseña incorrecta." });
    }

    const ventaExistente = await Venta.findByPk(id, {
      include: [{ model: DetalleVenta, as: "detalleVenta" }],
    });

    if (!ventaExistente) {
      await t.rollback();
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    for (const detalle of ventaExistente.detalleVenta) {
      await Producto.increment("stock", {
        by: detalle.cantidad,
        where: { id: detalle.producto_id },
        transaction: t,
      });
    }

    await DetalleVenta.destroy({ where: { venta_id: id }, transaction: t });

    let nuevoTotal = 0;
    const nuevosDetalles = [];

    for (const item of items) {
      const prod = await Producto.findByPk(item.producto_id, {
        transaction: t,
      });
      if (!prod) throw new Error(`Producto ID ${item.producto_id} no existe`);

      if (prod.stock < item.cantidad) {
        throw new Error(
          `Stock insuficiente para ${prod.nombre} (Stock: ${prod.stock})`
        );
      }

      const subtotal = parseFloat(prod.precio_final) * item.cantidad;
      nuevoTotal += subtotal;

      nuevosDetalles.push({
        venta_id: id,
        producto_id: prod.id,
        cantidad: item.cantidad,
        precio_unitario: prod.precio_final,
        subtotal: subtotal,
      });

      await prod.decrement("stock", { by: item.cantidad, transaction: t });
    }

    await DetalleVenta.bulkCreate(nuevosDetalles, { transaction: t });

    await ventaExistente.update(
      {
        total_venta: nuevoTotal,
        metodopago_id: metodopago_id || ventaExistente.metodopago_id,
        usuario_id: userId,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(200).json({ message: "Venta actualizada correctamente." });
  } catch (error) {
    await t.rollback();
    console.error("Error editando venta:", error);
    res.status(500).json({ message: error.message });
  }
};

const getVentas = async (req, res) => {
  try {
    const userId = req.userId;
    const userRole = (req.userRole || "").toUpperCase();

    const { vendedor, fecha, metodoPago } = req.query;

    let whereClause = {};

    // Empleado solo ve sus ventas
    if (userRole !== "DUEÑO" && userRole !== "DUENO") {
      whereClause.usuario_id = userId;
    } else {
      // Dueño puede filtrar por vendedor
      if (vendedor) whereClause.usuario_id = vendedor;
    }

    // Otros filtros
    if (fecha) whereClause.fecha = fecha;
    if (metodoPago) whereClause.metodopago_id = metodoPago;

    const ventas = await Venta.findAll({
      where: whereClause,
      include: [
        { model: Usuario, as: "usuario", attributes: ["id", "nombre", "email"] },
        { model: MetodoPago, as: "metodoPago" }
      ],
      order: [["fecha", "DESC"]],
    });

    res.json(ventas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener ventas" });
  }
};



const getVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    const venta = await Venta.findByPk(id, {
      include: [
        {
          model: DetalleVenta,
          as: "detalleVenta",
          include: [{ model: Producto, as: "producto" }],
        },
        { model: MetodoPago, as: "metodoPago" },
      ],
    });
    if (!venta) return res.status(404).json({ message: "Venta no encontrada" });
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getVendedores = async (req, res) => {
  try {
    const vendedores = await Usuario.findAll({
      where: { rol: "EMPLEADO" },
      attributes: ["id", "nombre", "email"]
    });

    const dueno = await Usuario.findAll({
      where: { rol: "DUEÑO" },
      attributes: ["id", "nombre", "email"]
    });

    res.json([...dueno, ...vendedores]);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener vendedores" });
  }
};

const getMetodosPago = async (req, res) => {
  try {
    const metodos = await MetodoPago.findAll({
      attributes: ["id", "nombre"]
    });

    res.json(metodos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener métodos de pago" });
  }
};


module.exports = {
  createVenta,
  deleteVenta,
  updateVenta,
  listarVentas,
  getVentas,
  getVentaById,
  getMetodosPago,
  getVendedores
};
