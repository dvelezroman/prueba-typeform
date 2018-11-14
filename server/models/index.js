const User = require("./User");
const Client = require("./Client");
const Order = require("./Order");
const Doctor = require("./Doctor");
const Group = require("./Group");
const Service = require("./Service");
const Office = require("./Office");
const Poll = require("./Poll");
const PollsSend = require("./PollsSend");
const Question = require("./Question");
const File = require("./File");
const MailServer = require("./MailServer");

Order.belongsTo(Client);
Order.belongsTo(Doctor);
Order.belongsTo(Group);
Order.belongsTo(Service);
Order.belongsTo(Office);
// ------------------------- //
PollsSend.belongsTo(Poll); // cada vez que se envia una encuesta se registra en PollsSend
Poll.belongsTo(Group); // por ahora solo voy a usar esta relacion para guardar cada vez que creo una encuesta
Poll.belongsTo(File); // se le coloca una referencia a cada formulario creado, a que archivo cargado pertenecen cuando lo crean
Question.belongsTo(Group); // esta voy a utilzar para guardar las preguntas que voy creando
Order.belongsTo(File, { 
  onDelete: 'cascade',
  hooks: true, 
}); // cada orden tiene un fileId que indica a que archivo cargado pertenece

module.exports = {
  User,
  Client,
  Order,
  Doctor,
  Group,
  Service,
  Office,
  Poll,
  Question,
  File,
  PollsSend,
  MailServer
};
