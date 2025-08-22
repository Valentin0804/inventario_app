const db = require('../models');
const { Op } = require('sequelize'); // Importamos los operadores de Sequelize

// Controlador para obtener el resumen de datos para el dashboard
const getSummary = async (req, res) => {
  try {
    const userId = req.userId; // Obtenemos el ID del usuario desde el middleware

    // --- 1. Calcular KPIs (Ventas e Ingresos de Hoy) ---
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const salesToday = await db.Venta.count({
      where: {
        usuarioId: userId,
        createdAt: {
          [Op.gte]: startOfToday, // gte = Greater Than or Equal (mayor o igual que)
        },
      },
    });

    // Nota: Asumo que tienes una columna 'total' en tu modelo de Venta
    const revenueToday = await db.Venta.sum('total', {
      where: {
        usuarioId: userId,
        createdAt: {
          [Op.gte]: startOfToday,
        },
      },
    }) || 0; // Si no hay ventas, sum() devuelve null, así que lo cambiamos por 0

    // --- 2. Encontrar productos con stock bajo ---
    const lowStockThreshold = 10; // Definimos "stock bajo" como 10 o menos unidades
    const lowStockProducts = await db.Producto.findAll({
      where: {
        usuarioId: userId,
        stock: {
          [Op.lte]: lowStockThreshold, // lte = Less Than or Equal (menor o igual que)
        },
      },
      order: [['stock', 'ASC']], // Ordenamos para mostrar los más críticos primero
      limit: 5, // Mostramos solo los 5 más críticos
    });

    // --- 3. Construir y enviar la respuesta ---
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
    console.error("Error al obtener el resumen del dashboard:", error);
    res.status(500).send({ message: "Error al obtener los datos del dashboard." });
  }
};

module.exports = {
  getSummary,
};