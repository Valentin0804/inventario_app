const db = require("../models");
const { Op } = require("sequelize");

const getSummary = async (req, res) => {
  try {
    // 1. Verificar qué ID de usuario está llegando
    const userId = req.userId; 
    console.log("🔎 ID de Usuario solicitante:", userId);

    if (!userId) {
      console.warn("⚠️ El req.userId llegó vacío o indefinido.");
      return res.status(400).json({ message: "Usuario no identificado." });
    }

    // 2. Configurar la fecha de inicio del día
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    console.log("📅 Filtrando ventas desde:", startOfToday.toISOString());

    // 3. Consultar Ventas (Count)
    const salesToday = await db.Venta.count({
      where: {
        usuario_id: userId,
        fecha: {
          [Op.gte]: startOfToday,
        },
      },
    });
    console.log("✅ Cantidad de ventas encontradas:", salesToday);

    // 4. Consultar Ingresos (Sum)
    // Nota: Sequelize devuelve null si no hay ventas, por eso el || 0
    const revenueRaw = await db.Venta.sum("total_venta", { 
        where: {
          usuario_id: userId,
          fecha: {
            [Op.gte]: startOfToday,
          },
        },
      });
    
    const revenueToday = revenueRaw || 0;
    console.log("💰 Total recaudado encontrado:", revenueToday);

    // 5. Consultar Stock Bajo
    const lowStockThreshold = 5;
    
    const lowStockProducts = await db.Producto.findAll({
      where: {
        usuario_id: userId, // Asegura que solo busque productos de este usuario
        stock: { // IMPORTANTE: Asegurate que en tu BD la columna es 'stock'
          [Op.lte]: lowStockThreshold,
        },
      },
      order: [["stock", "ASC"]], 
      limit: 5,
    });

    res.status(200).send({
      kpis: {
        salesToday,
        revenueToday,
      },
      alerts: {
        lowStockProducts,
      },
    });

  } catch (error) {
    console.error("❌ Error CRÍTICO en Dashboard:", error);
    res.status(500).send({ message: "Error al obtener los datos del dashboard." });
  }
};

module.exports = {
  getSummary,
};