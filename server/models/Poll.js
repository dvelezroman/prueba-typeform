const Sequelize = require("sequelize");
const db = require("./db");

const Poll = db.define("poll", {
  ref: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  subject: {
    type: Sequelize.STRING
  },
  greet: {
    type: Sequelize.STRING
  },
  send: {
    type: Sequelize.BOOLEAN,
    default: false
  }
});

module.exports = Poll;
