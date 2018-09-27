const Sequelize = require("sequelize");

const db = new Sequelize("postgres://localhost:5432/typeform", {
  logging: false
});

module.exports = db;
