const Sequelize = require("sequelize");
require("../config/config"); // config.js

const db = new Sequelize(
  "postgres://thwisvufwnbgji:983ccb401a679f367c1b7a20c135f933b345bbe8f12aeb0306126baf16393288@ec2-23-23-80-20.compute-1.amazonaws.com:5432/daljs2vll377iu",
  {
    logging: false,
    dialectOptions: {
      ssl: true
    }
  }
);

module.exports = db;
