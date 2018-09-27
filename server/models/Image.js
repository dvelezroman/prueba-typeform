const db = require("./db.js");
const DataTypes = db.Sequelize;

const Image = db.define("image", {
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  }
});

module.exports = Image;
