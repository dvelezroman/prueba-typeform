const Sequelize = require("sequelize");
require("../config/config"); // config.js

const db = new Sequelize(process.env.URI_DB, {
  logging: false,
  dialect: "postgres"
});

module.exports = db;
