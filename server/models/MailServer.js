const Sequelize = require("sequelize");
const db = require("./db");

const MailServer = db.define("mailserver", {
    description: {
        type: Sequelize.STRING,
        defaultValue: 'Servidor de Gmail'
    },
    service: {
        type: Sequelize.STRING,
        defaultValue: "Gmail"
    },
    host: {
        type: Sequelize.STRING
    },
    port: {
        type: Sequelize.INTEGER
    },
    secure: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    user: {
        type: Sequelize.STRING
    },
    pass: {
        type: Sequelize.STRING
    },
    selected: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
});

module.exports = MailServer;
