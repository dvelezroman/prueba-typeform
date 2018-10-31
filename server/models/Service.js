const Sequelize = require("sequelize");
const db = require("./db");

const Service = db.define("service", {
  description: {
    type: Sequelize.STRING
  }
});

module.exports = Service;
