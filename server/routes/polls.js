const express = require("express");
const router = express.Router();
const models = require("../models");
const Poll = models.Poll;

router.post("/new", function(req, res, next) {
  Poll.create(req.body).then(question => res.status(201).json(question));
});

router.get("/", function(req, res) {
  Poll.findAll({}).then(questions => res.status(200).json(questions));
});

module.exports = router;
