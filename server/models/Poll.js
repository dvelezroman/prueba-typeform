const Sequelize = require("sequelize");
const db = require("./db");

const Poll = db.define("poll", {
  ref: {
    type: Sequelize.STRING,
    allowNull: false
  },
  url: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Poll;
