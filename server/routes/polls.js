const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const models = require("../models");
const Group = models.Group;
const Poll = models.Poll;
const File = models.File;

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "caffeinasw@gmail.com",
    pass: "mentaleche2304"
  }
});

router.get("/test", (req, res) => {
  res.status(200).json("OK");
});

router.post("/send", (req, res, next) => {
  // aqui va la accion de enviar mail con gmail
  let mail = {
    from: "caffeinasw@gmail.com",
    to: "dvelezroman@gmail.com",
    subject: "Encuesta Prueba TypeForm",
    html: "name: <br/>TypeForm Prueba de envio de encuesta automatico<br/>email"
  };
  smtpTransport.sendMail(mail, (err, response) => {
    if (err) {
      console.log("email sending error");
      console.log(error);
    } else {
      console.log("Success");
    }
    smtpTransport.close();
  });
  res.status(201).json(req.params);
});

router.post("/new", function(req, res, next) {
  Group.findOne({ where: { description: req.body.group } }).then(group =>
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
