const Sequelize = require("sequelize");
const db = require("./db");
const crypto = require("crypto");
const secret = "Plataforma5";

const Users = db.define(
  "users",
  {
    nombre: {
      type: Sequelize.STRING,
      allowNull: false
    },
    apellido: {
      type: Sequelize.STRING,
      allowNull: false
    },
    edad: {
      type: Sequelize.INTEGER
    },
    mail: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    admin: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  },
  {
    getterMethods: {
      nombreApellido() {
        return this.nombre + " " + this.apellido;
      }
    },
    hooks: {
      beforeCreate: (users, options) => {
        users.password = Users.hashPassword(users.password);
      }
    }
  }
);

Users.authenticate = function authenticate(username, password) {
  Users.findOne({ where: { mail: username } }).then(user => {
    if (!user) return false;
    var hashedPassword = Users.hashPassword(password);
    if (user.password === hashedPassword) return user;
    return false;
  });
};

Users.hashPassword = function hashPassword(password) {
  return crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex");
};

Users.prototype.validPassword = function validPassword(password) {
  return this.password === Users.hashPassword(password);
};

module.exports = Users;
