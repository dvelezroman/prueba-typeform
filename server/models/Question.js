const Sequelize = require("sequelize");
const db = require("./db");

const Question = db.define("question", {
  ref: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false
  },
  shape: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  scale: {
    type: Sequelize.INTEGER
  },
  choices: {
    type: Sequelize.STRING
  },
  allow_multiple_selection: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  speciality: {
    type: Sequelize.STRING
  }
});

module.exports = Question;
