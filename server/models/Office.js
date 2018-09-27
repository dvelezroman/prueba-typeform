const Sequelize = require("sequelize");
const db = require("./db");

const Office = db.define("office", {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Office;
