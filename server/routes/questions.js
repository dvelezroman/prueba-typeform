const express = require("express");
const router = express.Router();
const models = require("../models");
const Question = models.Question;
const Group = models.Group;

router.post("/new", function(req, res, next) {
  Group.findOne({ where: { description: req.body.group } }).then(group => {
    Question.create(req.body.question).then(question => {
      question.setGroup(group);
      res.status(201).json(question);
    });
  });
});

router.get("/", function(req, res) {
  Question.findAll({}).then(questions => res.status(200).json(questions));
});

module.exports = router;
