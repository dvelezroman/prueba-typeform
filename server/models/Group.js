const Sequelize = require("sequelize");
const db = require("./db");

const Group = db.define("group", {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Group;
