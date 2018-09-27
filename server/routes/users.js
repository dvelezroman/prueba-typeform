const express = require("express");
const router = express.Router();
const models = require("../models");
const Users = models.Users;

module.exports = router;

router.post("/new", function(req, res, next) {
  Users.findOrCreate({
    where: { mail: req.body.mail },
    defaults: req.body
  }).then(data => res.status(201).json(data));
});

router.put("/adminupdate", isLoggedIn, (req, res) => {
  Users.update(
    {
      admin: req.body.admin
    },
    {
      where: { id: req.body.userId }
    }
  ).then(data => res.status(200).json(data));
});

router.delete("/delete/:id", isLoggedIn, (req, res) => {
  Users.destroy({ where: req.params }).then(data => res.status(200).json(data));
});

router.get("/search/:input", isLoggedIn, function(req, res) {
  Users.findOne({
    where: {
      mail: {
        $iLike: "%" + req.params.input + "%"
      }
    }
  }).then(user => res.json(user));
});

router.get("/:id", function(req, res) {
  Users.findOne({
    where: { id: req.params.id }
  }).then(user =>
    res.json({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      mail: user.mail,
      edad: user.edad,
      admin: user.admin
    })
  );
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.json({ status: "no está loggeado" });
  }
}
