const express = require("express");
const router = express.Router();
const models = require("../models");
const Group = models.Group;

router.post("/new", function(req, res, next) {
  Group.create(req.body).then(group => res.status(201).json(group));
});

router.get("/", function(req, res) {
  Group.findAll({}).then(groups => res.status(200).json(groups));
});

module.exports = router;
