const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const _ = require("underscore");
const models = require("../models");
const User = models.User;
const { tokenVerify, adminVerify } = require("../middlewares/authentication");

router.get("/test", (req, res, next) => {
  res.status(200).json("Todo OK..");
});

router.get("/:id", [tokenVerify], (req, res, next) => {
  let id = req.params.id;
  User.findById(id)
    .then(userFound => res.status(200).json({ error: false, msg: userFound }))
    .catch(err =>
      res.status(400).json({
        error: true,
        msg: err
      })
    );
});

router.post("/new", (req, res, next) => {
  let body = req.body;
  let user = {
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  };
  User.create(user)
    .then(userCreated =>
      res.status(201).json({ error: false, msg: userCreated })
    )
    .catch(err =>
      res.status(400).json({
        error: true,
        msg: err
      })
    );
});

router.put("/:id", [tokenVerify, adminVerify], (req, res, next) => {
  let id = req.params.id;
  let body = _.pick(req.body, ["name", "email", "role"]);
  User.findById(id).then(userFound =>
    userFound
      .update({
        name: body.name,
        email: body.email,
        role: body.role
      })
      .then(userUpdated =>
        res.status(201).json({
          error: false,
          msg: userUpdated
        })
      )
      .catch(err =>
        res.status(401).json({
          error: true,
          msg: err
        })
      )
  );
});

router.get("/", [tokenVerify], function(req, res) {
  User.findAll({}).then(users =>
    res.status(200).json({ error: false, msg: users })
  );
});

module.exports = router;
