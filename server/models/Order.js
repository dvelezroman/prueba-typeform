const Sequelize = require("sequelize");
const db = require("./db");

const Order = db.define("order", {
  ref: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  attended: {
    type: Sequelize.DATE
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Order;
