const Sequelize = require("sequelize");
const db = require("./db");

const Answer = db.define("answer", {
	type: {
		type: Sequelize.STRING
	},
	value: {
		type: Sequelize.STRING
	},
	office: {
		type: Sequelize.STRING
	},
	ref: {
		type: Sequelize.STRING
	},
	attended: {
		type: Sequelize.STRING
	}
});

module.exports = Answer;
