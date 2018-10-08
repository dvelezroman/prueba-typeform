const { Router } = require("express");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const router = Router();
const User = require("../models/User");

router.get("/test", (req, res, next) => {
  res.status(200).json("Todo Bien...");
});

router.post("/", (req, res) => {
  if (!req.body)
    res.status(400).json({
      error: true,
      data: {},
      msg: "Bad request"
    });
  let body = req.body;
  User.findOne({ where: { email: body.email } }).then(foundUser => {
    let token = jwt.sign({ user: foundUser }, process.env.TOKEN_SEED, {
      expiresIn: process.env.TOKEN_TIME
    });
    res.status(200).json({
      error: false,
      data: foundUser,
      token,
      success: true
    });
  });
});

router.get("/logout", function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
