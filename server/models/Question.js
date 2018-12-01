const Sequelize = require("sequelize");
const db = require("./db");

const Question = db.define("question", {
  question_ref: {
    type: Sequelize.STRING
  },
  ref: {
    type: Sequelize.STRING
  },
  title: {
    type: Sequelize.STRING
  },
  type: {
    type: Sequelize.STRING
  },
  shape: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  scale: {
    type: Sequelize.INTEGER
  },
  choices: {
    type: Sequelize.STRING
  },
  allow_multiple_selection: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  enabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  speciality: {
    type: Sequelize.STRING
  },
  categories: {
    type: Sequelize.STRING
  },
  subject: {
    type: Sequelize.STRING,
    defaultValue: "Encuesta de Satisfacción del Cliente - Medilink S.A."
  },
  greet: {
    type: Sequelize.STRING,
    defaultValue:
      "Por favor ayúdenos dando click sobre el enlace, y conteste una pregunta acerca de su experiencia en la atención recibida: "
  },
  url: {
    type: Sequelize.STRING
  }
});

module.exports = Question;
