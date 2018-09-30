const Sequelize = require("sequelize");
const db = require("./db");

const File = db.define("file", {
  ref: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = File;
