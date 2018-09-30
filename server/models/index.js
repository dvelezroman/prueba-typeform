const Users = require("./Users");
const Client = require("./Client");
const Order = require("./Order");
const Doctor = require("./Doctor");
const Group = require("./Group");
const Service = require("./Service");
const Office = require("./Office");
const Poll = require("./Poll");
const Question = require("./Question");
const File = require("./File");

Order.belongsTo(Client);
Order.belongsTo(Doctor);
Order.belongsTo(Group);
Order.belongsTo(Service);
Order.belongsTo(Office);
// ------------------------- //
Poll.belongsTo(Group); // por ahora solo voy a usar esta relacion para guardar cada vez que creo una encuesta
Question.belongsTo(Group); // esta voy a utilzar para guardar las preguntas que voy creando
Order.belongsTo(File); // cada orden tiene un fileId que indica a que archivo cargado pertenece

module.exports = {
  Users,
  Client,
  Order,
  Doctor,
  Group,
  Service,
  Office,
  Poll,
  Question,
  File
};
