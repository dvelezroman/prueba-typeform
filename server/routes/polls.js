const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const models = require("../models");
const Group = models.Group;
const Poll = models.Poll;
const PollsSend = models.PollsSend;
const File = models.File;
const html = require("./email");

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

router.post("/send", (req, res, next) => {
  // aqui va la accion de enviar mail con gmail
  let emails = req.body.clients.map(item => item.email);
  let names = req.body.clients.map(item => item.name);
  let url = req.body.urlForm;
  let body = html(url);
  let mail = {
    from: "caffeinasw@gmail.com", // aqui cambiar el correo del remitente
    to: emails,
    subject: "Encuesta de Satisfacción - MEDILINK S.A.",
    html: body
  };
  smtpTransport.sendMail(mail, (err, response) => {
    if (err) {
      console.log("email sending error");
      console.log(err);
      res.status(400).json({ msg: "error" });
    } else {
      Poll.update({ send: true }, { where: url }).then(pollUpdated => {
        if (pollUpdated) {
          PollsSend.create({ clients: 0, answers: 0 }).then(send => {
            send.setPoll(pollUpdated);
          });
        }
      });
      console.log("Success");
    }
    smtpTransport.close();
  });
  res.status(201).json({ msg: "ok" });
});

router.post("/new", function(req, res, next) {
  Group.findOne({ where: { id: req.body.group } }).then(group =>
    File.findOne({ where: { name: req.body.file } }).then(file =>
      Poll.create({
        ref: req.body.ref,
        url: req.body.url,
        name: req.body.name
      }).then(poll => {
        poll.setGroup(group);
        poll.setFile(file);
        res.status(201).json(poll);
      })
    )
  );
});

router.get("/", function(req, res) {
  Poll.findAll({ include: [Group, File] })
    .then(polls => res.status(200).json(polls))
    .catch(err => res.status(404).json(err));
});

module.exports = router;
