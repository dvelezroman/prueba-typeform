const { Router } = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const uuidv1 = require('uuid/v1');
const _ = require("underscore");
const router = Router();
const User = require("../models/User");

const smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "caffeinasw@gmail.com",
    pass: "telurico1604"
  }
});

router.get("/test", (req, res, next) => {
  res.status(200).json("Todo Bien...");
});



router.put("/password/recover", (req, res, next) => {
  let body = req.body;
  User.findOne({
    returning: true,
    where: { email: body.email }
  }).then(foundUser => {
      if (!foundUser) {
        res.status(200).json({
          error: true,
          data: "No existe el correo ingresado",
          token: null,
          success: false
        })
      };
      let newpassword = uuidv1();
      User.update({ password: bcrypt.hashSync(newpassword, 10) }, { returning: true, where: { email: foundUser.email }}).then(([ rowsUpdate, [updatedUser] ]) => {
        let token = jwt.sign({ user: updatedUser }, process.env.TOKEN_SEED, {
          expiresIn: process.env.TOKEN_TIME
        });
      let body = `<html><body>Tu nueva clave es : <h2>${newpassword}</h2><br>Asegurate de cambiarla cuando ingreses a la aplicación<br></body></html>`
      let mail = {
        from: "caffeinasw@gmail.com", 
        to: 'dvelezroman@gmail.com', //updatedUser.email,
        subject: `Recuperación de la contraseña - MEDILINK S.A.`,
        html: body
      };
      smtpTransport.sendMail(mail, (err, response) => {
        if (err) {
          res.status(200).json({ msg: "error" });
        } else {
          console.log("Se envió correo con contraseña nueva");
        }
        smtpTransport.close();
      });
      res.status(201).json({
        error: false,
        data: mail,
        token,
        success: true
      });
    })
  })
})

router.put("/password/new", (req, res, next) => {
  let body = req.body;
  User.findOne({
    returning: true,
    where: { email: body.email }
  }).then(foundUser => {
    if (bcrypt.compareSync(body.password, foundUser.password)) {
      User.update({ password: bcrypt.hashSync(body.newpassword, 10) }, { returning: true, where: { email: body.email }}).then(([rowsUpdate, [ updatedUser]]) => {
        let token = jwt.sign({ user: updatedUser }, process.env.TOKEN_SEED, {
          expiresIn: process.env.TOKEN_TIME
        });
        data = {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role
        };
        res.status(201).json({
          error: false,
          data,
          token,
          success: true
        })
      })
    }else {
      res.status(201).json({
        error: true,
        data: 'No se pudo cambiar la clave',
        token: null,
        success: false
      })
    }
  })
});

router.post("/", (req, res) => {
  let body = req.body;
  User.findOne({
    where: { email: body.email }
  }).then(foundUser => {
    if (foundUser === null) {
      res.status(200).json({
        error: true,
        data: {},
        token: "",
        success: false
      });
    } else {
      if (bcrypt.compareSync(body.password, foundUser.password)) {
        let token = jwt.sign({ user: foundUser }, process.env.TOKEN_SEED, {
          expiresIn: process.env.TOKEN_TIME
        });
        res.status(200).json({
          error: false,
          data: foundUser,
          token,
          success: true
        });
      } else {
        res.status(200).json({
          error: true,
          data: {},
          token: "",
          success: false
        });
      }
    }
  });
});

router.get("/logout", function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.get("/", ( req, res, next) => {
  User.findAll()
  .then(users => {
    if (users) {
      return res.status(200).json({
        error: true,
        data: "Hay usuarios activos",
        token: "",
        success: true,
      })
    }else {
      return res.status(200).json({
        error: true,
        data: "No existen usuarios activos",
        token: "",
        success: false
      })
    }
  })
})

module.exports = router;
