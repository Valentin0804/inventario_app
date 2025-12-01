const request = require("supertest");
const app = require("../src/services/app");
const sequelize = require("../src/config/db");

describe("Prueba de login", () => {
  it("Login correcto", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@gmail.com",
      password: "admin1234",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  it("Login incorrecto", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "noexiste@gmail.com",
      password: "xxx",
    });

    expect(res.statusCode).toBe(404);
  });
});

afterAll(async () => {
  await sequelize.close();
});
