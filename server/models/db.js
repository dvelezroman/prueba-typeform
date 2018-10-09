const Sequelize = require("sequelize");
require("../config/config"); // config.js

const db = new Sequelize("postgres://postgres:password@db:5432/typeform", {
  logging: false
});

module.exports = db;
