const { MercadoPagoConfig, Preference, Payment} = require("mercadopago");
const crypto = require('crypto');
require("dotenv").config();

const client = new MercadoPagoConfig({
  accessToken: process.env.ACCESS_TOKEN,
});

// Crear link de pago y QR simple
const crearQR = async (req, res) => {
  try {
    const { total, items } = req.body;

    const externalReference = `venta-${Date.now()}`;

    //console.log("Datos recibidos del front:", JSON.stringify(items, null, 2));

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
      auto_return: "approved",
      external_reference: externalReference
    };

    //console.log("ENVIANDO ESTO A MERCADO PAGO:", JSON.stringify(bodyPreference, null, 2));

    const preference = await new Preference(client).create({
      body: bodyPreference
    });

    return res.json({
      init_point: preference.init_point,
      external_reference: externalReference
    });

  } catch (error) {
    //console.error("Error MP:", error);
    return res.status(500).json({ message: "Error generando link de pago", details: error });
  }
};

const comprobarPago = async (req, res) => {
  try {
    const { external_reference } = req.params;

    //Buscamos los últimos 10 pagos de la cuenta
    const paymentSearch = await new Payment(client).search({
      options: {
        sort: 'date_created',
        criteria: 'desc',
        limit: 10
      }
    });

    const ultimosPagos = paymentSearch.results || [];

    //console.log(`🔎 Buscando etiqueta exacta: "${external_reference}"`);
    //console.log(`📊 Mercado Pago encontró ${ultimosPagos.length} pagos recientes en esta cuenta.`);
    
    /*ultimosPagos.forEach(p => {
        let icono = p.status === 'approved' ? '✅' : '⏳';
        let marca = p.external_reference === external_reference ? ' <--- ¡AQUÍ ESTÁ!' : '';
        console.log(`${icono} ID: ${p.id} | Estado: ${p.status} | Ref: "${p.external_reference}"${marca}`);
    });
    console.log("🔴🔴🔴 FIN DIAGNÓSTICO 🔴🔴🔴"); */
    
    const pagoEncontrado = ultimosPagos.find(p => 
        p.external_reference === external_reference && p.status === 'approved'
    );

    if (pagoEncontrado) {
      return res.json({ pagado: true, id_pago: pagoEncontrado.id });
    }

    return res.json({ pagado: false });

  } catch (error) {
    //console.error("Error comprobando pago:", error);
    return res.status(500).json({ message: "Error" });
  }
};

module.exports = { crearQR, comprobarPago };