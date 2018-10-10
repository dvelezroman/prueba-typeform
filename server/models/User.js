const Sequelize = require("sequelize");
const db = require("./db");

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM(["USER_ROLE", "ADMIN_ROLE"]),
    default: "USER_ROLE"
  }
});

// User.methods.toJSON = function() {
//   let user = this;
//   let userObject = user.toObject();
//   delete userObject.password;
//   return userObject;
// };

module.exports = User;
