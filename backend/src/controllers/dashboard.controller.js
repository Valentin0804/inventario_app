const db = require("../models");
const { Op, Sequelize } = require("sequelize");

const getSummary = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await db.Usuario.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isDueno = user.rol === "DUEÑO";
    const isEmpleado = user.rol === "EMPLEADO";

    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    /* FILTRO: dueño ve TODAS las ventas empleado solo sus ventas */
    const matchUser = isDueno ? {} : { usuario_id: userId };

    /* KPI */
    const salesToday = await db.Venta.count({
      where: {
        ...matchUser,
        fecha: { [Op.gte]: startOfToday },
      },
    });

    const revenueToday =
      (await db.Venta.sum("total_venta", {
        where: {
          ...matchUser,
          fecha: { [Op.gte]: startOfToday },
        },
      })) || 0;

    const revenueMonth =
      (await db.Venta.sum("total_venta", {
        where: {
          ...matchUser,
          fecha: { [Op.gte]: startOfMonth },
        },
      })) || 0;

    const averageTicket =
      salesToday > 0 ? (revenueToday / salesToday).toFixed(2) : 0;

    /* GRÁFICO ventas por método de pago */
    const salesByMethod = await db.Venta.findAll({
      where: {
        ...matchUser,
        fecha: { [Op.gte]: startOfToday },
      },
      attributes: [
        [db.sequelize.fn("COUNT", db.sequelize.col("Venta.id")), "cantidad"],
        [db.sequelize.fn("SUM", db.sequelize.col("total_venta")), "total"],
      ],
      include: [
        {
          model: db.MetodoPago,
          as: "metodoPago",
          attributes: ["nombre"],
        },
      ],
      group: ["metodoPago.id", "metodoPago.nombre"],
      raw: true,
      nest: true,
    });

    /** ALERTAS: dueño ve todos los productos, empleado solo los suyos */
    const lowStockProducts = await db.Producto.findAll({
      where: {
        ...matchUser,
        [Op.and]: [
          Sequelize.where(
            Sequelize.col("Producto.stock"),
            "<=",
            Sequelize.col("Producto.alarma_stock")
          ),
        ],
      },
      include: [
        {
          model: db.Proveedor,
          as: "proveedor",
          attributes: ["nombre", "telefono", "email"],
        },
      ],
      attributes: ["id", "nombre", "stock", "alarma_stock"],
      order: [["stock", "ASC"]],
      limit: 5,
    });

    return res.status(200).json({
      kpis: {
        salesToday,
        revenueToday,
        revenueMonth,
        averageTicket,
      },
      charts: { salesByMethod },
      alerts: { lowStockProducts },
      rol: user.rol,
    });
  } catch (error) {
    console.error("❌ Error en Dashboard:", error);
    res.status(500).json({
      message: "Error al obtener datos del dashboard",
    });
  }
};

module.exports = { getSummary };
