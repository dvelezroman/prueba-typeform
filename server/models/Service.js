const Sequelize = require("sequelize");
const db = require("./db");

const Service = db.define("service", {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Service;
