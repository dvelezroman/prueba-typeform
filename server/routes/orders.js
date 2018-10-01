const express = require("express");
const router = express.Router();
const models = require("../models");
const File = models.File;
const Order = models.Order;
const Client = models.Client;
const Doctor = models.Doctor;
const Group = models.Group;
const Office = models.Office;

router.get("/test", (req, res, next) => {
  res.status(200).json("Todo OK..");
});

router.get("/:fileName", function(req, res, next) {
  File.findOne({ where: { name: req.params.fileName } })
    .then(file =>
      Order.findAll({
        where: { fileId: file.id },
        include: [Client, Doctor, Group, Office]
      }).then(orders => res.status(200).json(orders))
    )
    .catch(err => res.status(500).json("Error"));
});

module.exports = router;
