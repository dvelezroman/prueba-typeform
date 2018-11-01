const express = require("express");
const router = express.Router();
const models = require("../models");
const File = models.File;
const Order = models.Order;
const Client = models.Client;
const Doctor = models.Doctor;
const Group = models.Group;
const Office = models.Office;

router.get("/test", (req, res) => {
  res.status(200).json("OK");
});

router.get("/:name/orders", async (req, res) => {
  let name = req.params.name;
  let file = await File.findOne({ where: { name: name }}).then(found => found);
  //console.log('Name : ', name);
  Order.findAll({ where: { fileId: file.id }, include: [ File, Client, Doctor, Group, Office ]})
  .then(array => {
    let orders = array.map(item => ({
        id: item.id,
        ref: item.ref,
        attended: item.attended,
        hcu: item.client.hcu,
        name: item.client.name,
        email: item.client.email,
        doctor: item.doctor.name,
        group: item.group.description,
        office: item.office.description
      })
    );
    res.status(200).json({ error: false, data: orders });
  })
  .catch(err => res.status(200).json({ error: true, data: err }))
});

router.get("/:ref", (req, res) => {
  let ref = req.params.ref;
  File.findOne({ where: { ref: ref }})
  .then(file => res.status(200).json({ error: false, data: file }))
  .catch(err => res.status(200).json({ error: true, data: err }));
});

router.get("/", function(req, res) {
  File.findAll({}).then(files => res.status(200).json({ error: false, data: files }));
});

module.exports = router;
