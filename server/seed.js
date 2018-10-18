const bcrypt = require("bcrypt");
const { Group, Question, User } = require("./models/index");

const groups = [
  {
    description: "Consultas ambulatorias"
  },
  {
    description: "Procedimientos"
  },
  {
    description: "Laboratorio Clinico"
  },
  {
    description: "Laboratorio Patologico"
  },
  {
    description: "Odontologia"
  },
  {
    description: "Rayos X"
  },
  {
    description: "Urologia"
  }
];
const uuid = require("uuid");
const questions = [
  {
    ref: uuid(),
    title: "Califique el Servicio",
    type: "rating",
    shape: "star",
    description: "Califique la atención del servicio recibido",
    scale: "7",
    groupId: 1
  },
  {
    ref: uuid(),
    title: "Ingrese su email",
    type: "email",
    shape: "",
    description: "Escriba su dirección de email, no le enviaremos spam",
    scale: 0,
    groupId: 1
  },
  {
    ref: uuid(),
    title: "Cómo se llama?",
    type: "short_text",
    shape: "",
    description: "Ingrese su nombre completo",
    scale: 0,
    groupId: 1
  },
  {
    ref: uuid(),
    title: "Esta usted contento con el servicio que recibe?",
    type: "yes_no",
    shape: "",
    description: "",
    scale: 0,
    groupId: 1
  }
];

const admin = {
  name: "Medilink",
  email: "administrador@medilink.com",
  password: bcrypt.hashSync("medilink", 10),
  role: "ADMIN_ROLE"
};

function seed() {
  User.create(admin)
    .then(userCreated => console.log("Admin User Created"))
    .catch(err => err);
}

module.exports = seed;
