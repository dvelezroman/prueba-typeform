const Sequelize = require("sequelize");
require("../config/config"); // config.js

const db = new Sequelize(process.env.URI_DB, {
  logging: false
});

module.exports = db;
