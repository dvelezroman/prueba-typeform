const express = require("express");
const router = express.Router();
const models = require("../models");
const Group = models.Group;

router.post("/new", function(req, res, next) {
  Group.create(req.body).then(question => res.status(201).json(question));
});

router.get("/", function(req, res) {
  Group.findAll({}).then(questions => res.status(200).json(questions));
});

module.exports = router;
