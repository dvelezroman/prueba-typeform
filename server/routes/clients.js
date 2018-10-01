const express = require("express");
const router = express.Router();
const models = require("../models");

const Client = models.Client;

router.get("/test", (req, res) => {
  res.status(200).json("OK");
});

router.get("/emails", function(req, res) {
  Client.findAll({
    where: { fileId: req.body.fileId, groupId: req.body.groupId }
  })
    .then(clients => res.status(200).json(clients))
    .catch(err => res.status(404).json(err));
});

module.exports = router;
