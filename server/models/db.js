const Sequelize = require("sequelize");
require("../config/config"); // config.js

const rds_endpoint =
	"caffeinaswinstance.ckyxzgfsuoby.sa-east-1.rds.amazonaws.com";
const rds_user = "postgres";
const rds_password = "password";
const rds_db = "typeform";

// const db = new Sequelize(rds_db, rds_user, rds_password, {
//   host: rds_endpoint,
//   logging: false,
//   dialect: 'postgres'
// });

const db = new Sequelize(process.env.URI_DB, {
	logging: false,
	dialect: "postgres",
	pool: {
		max: 30,
		min: 1,
		acquire: 20000,
		idle: 20000
	}
});

module.exports = db;

// const sequelize = new Sequelize(dbname, username, password, {
//   host: 'pgssltest.xxxxxxxxxxxx.region.rds.amazonaws.com',
//   dialect: 'postgres',
//   dialectOptions: {
//      ssl: true
//   }
// });
