const db = require("../models");
const { Op, Sequelize } = require("sequelize");

const getSummary = async (req, res) => {
  try {
    const userId = req.userId; 

    if (!userId) {
      return res.status(400).json({ message: "Usuario no identificado." });
    }

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const salesToday = await db.Venta.count({
      where: {
        usuario_id: userId,
        fecha: { [Op.gte]: startOfToday },
      },
    });

    const revenueRaw = await db.Venta.sum("total_venta", { 
        where: {
          usuario_id: userId,
          fecha: { [Op.gte]: startOfToday },
        },
      });
    const revenueToday = revenueRaw || 0;

    const revenueMonthRaw = await db.Venta.sum("total_venta", { 
        where: {
          usuario_id: userId,
          fecha: { [Op.gte]: startOfMonth },
        },
      });
    const revenueMonth = revenueMonthRaw || 0;

    const averageTicket = salesToday > 0 ? (revenueToday / salesToday).toFixed(2) : 0;

    const salesByMethod = await db.Venta.findAll({
        where: {
            usuario_id: userId,
            fecha: { [Op.gte]: startOfToday },
        },
        attributes: [
            [db.sequelize.fn('COUNT', db.sequelize.col('Venta.id')), 'cantidad'],
            [db.sequelize.fn('SUM', db.sequelize.col('total_venta')), 'total']
        ],
        include: [{
            model: db.MetodoPago,
            as: 'metodoPago', 
            attributes: ['nombre']
        }],
        group: ['metodoPago.id', 'metodoPago.nombre'], 
        raw: true, 
        nest: true
    });

    const lowStockProducts = await db.Producto.findAll({
      where: {
        usuario_id: userId,
        [Op.and]: [
          Sequelize.where(
            Sequelize.col("Producto.stock"),
            "<=",
            Sequelize.col("Producto.alarma_stock")
          )
        ]
      },
      include: [{
        model: db.Proveedor,
        as: "proveedor",
        attributes: ["nombre", "telefono", "email"],
      }],
      attributes: [
        "id",
        "nombre",
        "stock",
        "alarma_stock" 
      ],
      order: [["stock", "ASC"]],
      limit: 5,
    });

    res.status(200).send({
      kpis: {
        salesToday,       
        revenueToday,    
        revenueMonth,     
        averageTicket    
      },
      charts: {
        salesByMethod,   
      },
      alerts: {
        lowStockProducts,
      },
    });

  } catch (error) {
    console.error("❌ Error en Dashboard:", error);
    res.status(500).send({ message: "Error al obtener los datos del dashboard." });
  }
};

module.exports = {
  getSummary,
};