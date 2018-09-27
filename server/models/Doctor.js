const Sequelize = require("sequelize");
const db = require("./db");

const Doctor = db.define("doctor", {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  code: {
    type: Sequelize.STRING
  }
});

module.exports = Doctor;
