const Sequelize = require("sequelize");
const db = require("./db");

const Answer = db.define("answer", {
  type: {
    type: Sequelize.STRING
  },
  value: {
    type: Sequelize.STRING
  }
});

module.exports = Answer;
