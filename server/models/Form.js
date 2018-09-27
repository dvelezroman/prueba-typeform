const Sequelize = require("sequelize");
const db = require("./db");

const Form = db.define("form", {
  ref: {
    type: Sequelize.STRING,
    allowNull: false
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  theme: {
    type: Sequelize.STRING,
    allowNull: false
  },
  workspace: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Form;
