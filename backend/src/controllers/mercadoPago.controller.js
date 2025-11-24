const { MercadoPagoConfig, Preference } = require("mercadopago");
require("dotenv").config();

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

// Crear link de pago y QR simple
const crearQR = async (req, res) => {
  try {
    const { total, items } = req.body;

    // 1. DEBUG: Ver qué llega del front
    console.log("Datos recibidos del front:", JSON.stringify(items, null, 2));

    // Preparamos el objeto body ANTES de enviarlo
    const bodyPreference = {
      items: items.map(i => ({
        title: `Producto ${i.producto_id}`,
        quantity: parseInt(i.cantidad),
        unit_price: Number(i.precio_unitario),
        currency_id: "ARS"
      })),
      back_urls: {
           success: "https://www.google.com",
            failure: "https://www.google.com",
            pending: "https://www.google.com"
      },
      auto_return: "approved"
    };

    // 2. DEBUG: Ver qué enviamos a MP
    console.log("-------------------------------------------------");
    console.log("ENVIANDO ESTO A MERCADO PAGO:", JSON.stringify(bodyPreference, null, 2));
    console.log("-------------------------------------------------");

    const preference = await new Preference(client).create({
      body: bodyPreference
    });

    return res.json({
      init_point: preference.init_point,
    });

  } catch (error) {
    console.error("Error MP:", error);
    // Importante: Agregué 'return' aquí para evitar que la ejecución continúe si hay error
    return res.status(500).json({ message: "Error generando link de pago", details: error });
  }
}; 

module.exports = { crearQR };