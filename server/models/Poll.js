const Sequelize = require("sequelize");
const db = require("./db");

const Poll = db.define("poll", {
  ref: {
    type: Sequelize.STRING
  },
  url: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING,
    defaultValue: "Formulario de Encuesta"
  },
  name: {
    type: Sequelize.STRING
  },
  subject: {
    type: Sequelize.STRING,
    defaultValue: "Encuesta de Satisfacción del Cliente - Medilink S.A."
  },
  greet: {
    type: Sequelize.STRING,
    defaultValue: "Por favor ayúdenos dando click sobre el enlace, y conteste una pregunta acerca de su experiencia en la atención recibida: "
  },
  send: {
    type: Sequelize.BOOLEAN,
    default: false
  }
});

module.exports = Poll;
