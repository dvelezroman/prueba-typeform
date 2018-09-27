const Sequelize = require("sequelize");
const db = require("./db");

const Client = db.define("client", {
  hcu: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING
  }
});

module.exports = Client;
