const express = require("express");
const router = express.Router();
const models = require("../models");
const File = models.File;

router.get("/test", (req, res) => {
  res.status(200).json("OK");
});

router.get("/", function(req, res) {
  File.findAll({}).then(files => res.status(200).json(files));
});

module.exports = router;
