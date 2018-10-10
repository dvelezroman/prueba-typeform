const Sequelize = require("sequelize");
const db = require("./db");

const PollsSend = db.define("pollsend", {
  clients: {
    type: Sequelize.INTEGER,
    default: 0
  },
  answers: {
    type: Sequelize.INTEGER,
    default: 0
  }
});

module.exports = PollsSend;
