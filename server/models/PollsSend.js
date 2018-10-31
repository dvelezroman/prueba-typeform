const Sequelize = require("sequelize");
const db = require("./db");

const PollsSend = db.define("pollsend", {
  clients: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  answers: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  average: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
});

module.exports = PollsSend;
