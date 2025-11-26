# 📄 Propuesta del Proyecto

El objetivo del sistema es desarrollar una plataforma web para la **gestión de inventario y ventas** de un negocio pequeño.

Permite a los usuarios registrar productos, proveedores, metodos de pagos, categoria de productos gestionar inventarios, realizar ventas. Además, el sistema facilita la toma de decisiones al proporcionar alertas de stock bajo y listas de pedidos para distribuidores.
El sistema está pensado para ser escalable, permitiendo en el futuro la integración de funcionalidades avanzadas como la lectura de códigos de barras y la automatización de pedidos a distribuidores.


## Requerimientos Generales
- Desarrollado completamente en JavaScript.
- Frontend en Angular.
- Backend en Node.js + Express.
- Base de datos persistente en MySQL.
- ORM: Sequelize.
- API REST segura con autenticación JWT.
- Rutas protegidas.
- Módulos principales:
  - Usuarios y autenticación.
  - Productos.
  - Categorías.
  - Proveedores.
  - Ventas.
  - Métodos de pago.
  - Integración con MercadoPago.

## Integración con MercadoPago
- Pagos QR y checkout preferencial.
- Webhook para confirmar pagos.
