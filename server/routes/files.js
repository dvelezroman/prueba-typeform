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

router.get("/:id/orders", async (req, res) => {
  //console.log('Req.params: ', req.params);
  let id = req.params.id;
  let file = await File.findById(id).then(found => found.dataValues);
  //console.log('File : ', file);
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
        groupId: item.groupId,
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

router.delete("/delete/:id", (req, res) => {
  let fileId = req.params.id;
  File.destroy({ where: { id: fileId }}).then(() => {
    Order.destroy({ where: { fileId: fileId }})
    .then(data => res.status(201).json({ error: false, data, msg: "Registro Eliminado" }));
  });
});

router.get("/", function(req, res) {
  File.findAll({}).then(files => res.status(200).json({ error: false, data: files }));
});

module.exports = router;
