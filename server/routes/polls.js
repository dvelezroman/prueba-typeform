const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const models = require("../models");
const Group = models.Group;
const Poll = models.Poll;
const PollsSend = models.PollsSend;
const File = models.File;
const { html } = require("./email");

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "caffeinasw@gmail.com",
    pass: "telurico1604"
  }
});

router.get("/test", (req, res) => {
  res.status(200).json("OK");
});

router.get("/sendpolls", (req, res, next) => {
  // obtiene las encuestas que han sido enviadas a  correos
  PollsSend.findAll({ include: [{model: Poll, include: [ Group, File ]}] })
    .then(polls => res.status(200).json(polls))
    .catch(err => res.status(404).json(err));
})

router.post("/sendpolls", (req, res, next) => {
  // actualiza el numero de answers para una encuesta
  let answers = req.body.answers; // recibe el numero de respuestas para una encuesta
  let ref = req.body.ref; // recibe el ref de la encuesta para poder buscarla y actualizarle el numero de respuestas
  let average = 0;
  //console.log('Answers: ', answers[0].answers[0].number);
  let len = 0;
  if (answers.length)
    {
      let sum = 0;
      len = 0;
      answers.forEach(element => {
        //console.log('answer', element.answers[0])
        if (element.answers && element.answers[0].type === 'number') {
          len++;
          sum = sum + element.answers[0].number;
        }else if(element.answers && element.answers[0].type === 'boolean') { // hay que poner que lleve los si y no, y las multiple decisiones
          len++;
          sum = element.answers[0].boolean ? sum + 1 : sum;
        }
      });
      average = sum / len;
    }
  //console.log('Average: ', average);
  Poll.findOne({ where: { ref: ref }})
  .then(poll => PollsSend.update({ answers: len, average: average }, { where: { pollId: poll.id } }))
  .then(() => res.status(201).json({ error: false, msg: 'updated' }));
});

// sends email to a group of emails belonging a one category
router.post("/send", (req, res, next) => {
  //console.log('Body: ', req.body);
  let params = req.body;
  // aqui va la accion de enviar mail con gmail
  let emails = params.clients.map(item => item.email);
  let file = params.fileId;
  let names = params.clients.map(item => item.name);
  let url = params.url;
  let subject = params.subject;
  let greet = params.greet;
  let question = {
    title: params.title,
    description: params.description,
    type: params.type,
    scale: params.scale,
    choices: params.choices,
    shape: params.shape,
    allow_multiple_selection: params.allow_multiple_selection
  };
  //console.log('question : ', question);
  let poll_html = html(url, question); // tengo que enviarle la pregunta y el url
  //console.log('Body listo: ', poll_html);
  let mail = {
    from: "Servicios al Cliente - Medilink S.A. <dvelezroman@gmail.com>", // aqui cambiar el correo del remitente
    to: emails, // esto lo vamos a abrir con for o map y poder personalizarlo con el nombre
    subject: `${subject}`,
    html: poll_html,
  };
  smtpTransport.sendMail(mail, (err, response) => {
    if (err) {
      res.status(200).json({ error: true, msg: "Error al enviar correo" });
    } else {
      Poll.update({ send: true }, { returning: true, where: { url: url } }).then(([ rowsUpdate, [updatedPoll] ]) => {
        if (updatedPoll) {
          PollsSend.create({ clients: emails.length, answers: 0 }).then(sendPoll => {
            sendPoll.setPoll(updatedPoll);
            File.findById(file).then(file => {updatedPoll.setFile(file)});
          });
        }
      });
    }
    smtpTransport.close();
  });
  res.status(201).json({ error: false, msg: "Formulario Enviado" });
});

router.post("/new", function(req, res, next) {
  //console.log('PollData: ', req.body);
  let question = req.body.poll;
  let ref = req.body.ref
  let url = req.body.url;
  Group.findOne({ where: { id: Number(question.group) } }).then(group =>
    Poll.create({
      ref: ref,
      url: url,
      name: question.subject,
      subject: question.subject,
      greet: question.greet
    }).then(poll => {
      poll.setGroup(group);
      //poll.setFile(file);
      res.status(201).json(poll);
    })
  );
});

router.get("/", function(req, res) {
  Poll.findAll({ include: [Group] })
    .then(polls => res.status(200).json(polls))
    .catch(err => res.status(200).json(err));
});

module.exports = router;
