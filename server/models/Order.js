const Sequelize = require("sequelize");
const db = require("./db");

const Order = db.define("order", {
  ref: {
    type: Sequelize.STRING,
    allowNull: false
  },
  attended: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  }
});

module.exports = Order;
