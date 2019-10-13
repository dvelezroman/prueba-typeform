const Sequelize = require('sequelize');
const db = require('./db');

const PollsSend = db.define('pollsend', {
	ref: {
		type: Sequelize.STRING
	},
	sendtime: {
		type: Sequelize.DOUBLE
	},
	clients: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	answers: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	average: {
		type: Sequelize.INTEGER,
		defaultValue: 0
	},
	description: {
		type: Sequelize.TEXT
	}
});

module.exports = PollsSend;
