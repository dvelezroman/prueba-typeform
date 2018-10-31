const express = require("express");
const router = express.Router();
const models = require("../models");
const Question = models.Question;
const Group = models.Group;

router.get("/test", (req, res, next) => {
  res.status(200).json("Todo OK..");
});
router.post("/new", function(req, res, next) {
  Group.findOne({ where: { id: req.body.group } }).then(group => {
    Question.create(req.body.question).then(question => {
      question.setGroup(group);
      res.status(201).json(question);
    });
  });
});

router.put("/disable", (req, res, next) => {
  Question.findOne({ where: { ref: req.body.ref }})
  .then(question => {
    Question.update({ enabled: !question.enabled }, { where: { ref: question.ref }})
    .then(updated => {
      res.status(200).json({
        error: false,
        data: updated
      })
    })
  })
});

router.get("/", function(req, res) {
  Question.findAll({ include: [Group] }).then(questions =>
    res.status(200).json(questions)
  );
});

module.exports = router;
