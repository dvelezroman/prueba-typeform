const Sequelize = require("sequelize");
const db = require("./db");

const Office = db.define("office", {
  description: {
    type: Sequelize.STRING
  }
});

module.exports = Office;
