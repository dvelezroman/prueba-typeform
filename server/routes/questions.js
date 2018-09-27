const express = require("express");
const router = express.Router();
const models = require("../models");
const Question = models.Question;

router.post("/new", function(req, res, next) {
  Question.create(req.body).then(question => res.status(201).json(question));
});

router.get("/", function(req, res) {
  Question.findAll({}).then(questions => res.status(200).json(questions));
});

module.exports = router;
