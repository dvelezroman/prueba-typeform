const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const router = Router();
const User = require("../models/User");

router.get("/test", (req, res, next) => {
  res.status(200).json("Todo Bien...");
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

module.exports = router;
