const { Sequelize } = require("sequelize");

const config = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "soap@123",
  database: process.env.DB_NAME || "cicd",
  host: process.env.DB_HOST || "db",
  dialect: "mysql",
};

const sequelize = new Sequelize(config);

module.exports = sequelize;
