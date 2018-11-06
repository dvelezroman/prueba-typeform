const express = require("express");
const router = express.Router();
const models = require("../models");
const Question = models.Question;
const Group = models.Group;

router.get("/test", (req, res, next) => {
  res.status(200).json("Todo OK..");
});
router.post("/new", function(req, res, next) {
  console.log('QuestionBody: ', req.body);
  let question = req.body;
  const newQuestion = {
    subject: question.subject,
    greet: question.greet,
    ref: question.ref,
    title: question.title,
    type: question.type,
    description: question.description,
    speciality: question.speciality,
    scale: question.scale,
    shape: question.shape,
    choices: question.choices,
    allow_multiple_selection: question.allow_multiple_selection,
  }
  Group.findOne({ where: { id: question.group } }).then(group => {
    Question.create(newQuestion).then(created => {
      created.setGroup(group);
      res.status(201).json(created);
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

router.put("/update/:ref", (req, res) => {
  let ref = req.params.ref;
  let body = req.body;
  Question.update(body, { returning: true, where: { ref: ref } })
  .then(([ rowsUpdate, [updatedQuestion] ]) => {
    res.status(201).json({ error: false, data: updatedQuestion })
  }).catch(err => res.status(200).json({ error: true, data: err }));
});

router.get("/:id", (req, res, next) => {
  Question.findById(req.params.id)
  .then(found => res.status(200).json({ error: false, data: found }))
  .catch(err => res.status(200).json({ error: true, data: err }))
});

router.get("/", function(req, res) {
  Question.findAll({ include: [Group] }).then(questions =>
    res.status(200).json(questions)
  );
});

module.exports = router;
