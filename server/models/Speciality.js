const Sequelize = require("sequelize");
const db = require("./db");

const Speciality = db.define("speciality", {
  description: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Speciality;
