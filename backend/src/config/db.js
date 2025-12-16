require("dotenv").config();
const { Sequelize } = require("sequelize");

// Si existe MYSQL_URL (Railway) la usa, si no, usa las variables locales (.env)
const sequelize = process.env.MYSQL_URL
  ? new Sequelize(process.env.MYSQL_URL, {
      dialect: "mysql",
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT || "mysql",
        logging: false,
      }
    );

module.exports = sequelize;