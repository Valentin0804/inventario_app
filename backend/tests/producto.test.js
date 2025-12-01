require("dotenv").config();
const request = require("supertest");
const app = require("../src/services/app");
const sequelize = require("../src/config/db");

describe("Pruebas de integración - Productos", () => {
  let token = "";
  let productoCreadoId = null;

  beforeAll(async () => {
    await sequelize.authenticate();

    const res = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "admin1234",
    });

    token = res.body.accessToken;
  });

  it("Debe crear un producto correctamente", async () => {
    const res = await request(app)
      .post("/api/productos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        codigo_barras: "ABC12345",
        nombre: "Jugo de Naranja",
        marca: "Cepita",
        precio_neto: 100,
        porcentaje_ganancia: 20,
        precio_final: 120,
        descripcion: "Jugo de naranja botella 1L",
        stock: 10,
        alarma_stock: 3,
        categoria_id: 1,
        proveedor_id: 1,
        usuario_id: 1,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");

    productoCreadoId = res.body.id;
  });

  it("Debe obtener la lista de productos", async () => {
    const res = await request(app)
      .get("/api/productos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("Debe obtener un producto por ID", async () => {
    const res = await request(app)
      .get(`/api/productos/${productoCreadoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.id).toBe(productoCreadoId);
  });

  it("Debe actualizar un producto", async () => {
    const res = await request(app)
      .put(`/api/productos/${productoCreadoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        nombre: "Jugo de Manzana",
        stock: 20,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });

  it("Debe eliminar un producto", async () => {
    const res = await request(app)
      .delete(`/api/productos/${productoCreadoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  afterAll(async () => {
    await sequelize.close();
  });
});
