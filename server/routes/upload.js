const express = require("express");
var fs = require("fs");
const router = express.Router();
const uuid = require("uuid");
const { upload } = require("./multer");
const { storeInDataBase, getDataInArrays } = require("./functions");
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const models = require("../models");

const Client = models.Client;
const Office = models.Office;
const Order = models.Order;
const Doctor = models.Doctor;
const Group = models.Group;
const Service = models.Service;
const File = models.File;

/** API path that will upload the files */
router.post("/", function(req, res) {
  let exceltojson; //Initialization
  upload(req, res, async function(err) {
    if (err) {
      res.json({ error_code: 1, err_desc: err });
      return;
    }
    /** Multer gives us file info in req.file object */
    if (!req.file) {
      res.json({ error_code: 1, err_desc: "No file passed" });
      return;
    }
    //start convert process
    /** Check the extension of the incoming file and
     *  use the appropriate module
     */
    if (
      req.file.originalname.split(".")[
        req.file.originalname.split(".").length - 1
      ] === "xlsx"
    ) {
      exceltojson = xlsxtojson;
    } else {
      exceltojson = xlstojson;
    }
    try {
      exceltojson(
        {
          input: req.file.path, //the same path where we uploaded our file
          output: null, //since we don't need output.json
          lowerCaseHeaders: true
        },
        async function(err, result) {
          if (err) {
            return res.json({ error_code: 1, err_desc: err, data: null });
          }
          // here we must store in DataBase
          const dataArray = getDataInArrays(result);
          // promises to create the data in database
          let ref = uuid();
          let fileName = req.file.originalname.split(".")[0];
          let promises_file = File.findOrCreate({
            where: { ref: ref, name: fileName }
          });

          let promises_clients = dataArray.clients.map(client =>
            Client.findOrCreate({
              where: { hcu: client.hcu, name: client.name, email: client.email }
            })
          );

          let promises_offices = dataArray.offices.map(office =>
            Office.findOrCreate({ where: { description: office.description } })
          );

          let promises_doctors = dataArray.doctors.map(doctor =>
            Doctor.findOrCreate({ where: { name: doctor.name } })
          );

          let promises_groups = dataArray.groups.map(group =>
            Group.findOrCreate({ where: { description: group.description } })
          );

          let promises_services = dataArray.services.map(service =>
            Service.findOrCreate({
              where: { description: service.description }
            })
          );

          let promises_orders = dataArray.orders.map(order =>
            Client.findOne({ where: { hcu: order.hcu } }).then(client => {
              Doctor.findOne({ where: { name: order.doctor } }).then(doctor =>
                Group.findOne({ where: { description: order.group } }).then(
                  group =>
                    Service.findOne({
                      where: { description: order.service }
                    }).then(service =>
                      Office.findOne({
                        where: { description: order.office }
                      }).then(office =>
                        File.findOne({ where: { ref: ref } }).then(file =>
                          Order.create(order).then(orderCreated => {
                            orderCreated.setClient(client);
                            orderCreated.setDoctor(doctor);
                            orderCreated.setGroup(group);
                            orderCreated.setService(service);
                            orderCreated.setOffice(office);
                            orderCreated.setFile(file);
                          })
                        )
                      )
                    )
                )
              );
            })
          );
          // promises to create the data in database
          let message = await storeInDataBase(
            promises_file,
            promises_clients,
            promises_doctors,
            promises_groups,
            promises_offices,
            promises_services,
            promises_orders
          );

          const response = {
            error_code: 0,
            err_desc: null,
            message: message
          };
          res.json(response);
        }
      );
      try {
        // code to delete the file after the convertion and store of the data
        fs.unlinkSync(req.file.path);
      } catch (e) {
        //error deleting the file
      }
    } catch (e) {
      res.json({ error_code: 1, err_desc: "Corupted excel file" });
    }
  });
});

module.exports = router;
