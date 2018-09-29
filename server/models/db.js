const Sequelize = require("sequelize");

const db = new Sequelize("postgres://postgres@localhost:5432/typeform", {
  logging: false
});

module.exports = db;

// postgres://todoapp@postgres/todos
