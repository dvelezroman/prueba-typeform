const express = require("express");
var fs = require("fs");
const router = express.Router();
const _ = require("lodash");
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
  upload(req, res, function(err) {
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
            return res.status(200).json({
              error_code: 1,
              err_desc: err,
              data: "Error en la conversion a json"
            });
          }
          // here we must store in DataBase
          //console.log("Result: ", result);
          const dataArray = getDataInArrays(result);
          //console.log("DataArray: ", dataArray);
          if (!dataArray.orders.length) {
            return res.status(200).json({ error_code: 2 });
          }
          // promises to create the data in database
          let ref = uuid();
          let fileName = req.file.originalname.split(".")[0];
          // stores file uploaded
          let promises_file = File.findOrCreate({
            where: { name: fileName },
            defaults: { ref: ref }
          });
          // stores the clients contained in the file uploaded
          let clients = _.uniqBy(dataArray.clients, client => client.hcu); // deletes repeated clients
          let promises_clients = clients.map(client =>
            Client.findOrCreate({
              where: { hcu: client.hcu },
              defaults: { name: client.name, email: client.email }
            })
          );
          // stores the offices contained in the orders of the file uploaded
          let offices = _.uniqBy(
            dataArray.offices,
            office => office.description
          ); // deletes repeated offices
          let promises_offices = offices.map(office =>
            Office.findOrCreate({ where: { description: office.description } })
          );
          // stores the doctors contained in the orders of the file uploaded
          let doctors = _.uniqBy(dataArray.doctors, doctor => doctor.name); // deletes repeated doctors
          let promises_doctors = doctors.map(doctor =>
            Doctor.findOrCreate({ where: { name: doctor.name } })
          );
          // stores the groups contained the orders of the file uploaded
          let groups = _.uniqBy(dataArray.groups, group => group.description); // deletes repeated categories
          let promises_groups = groups.map(group =>
            Group.findOrCreate({ where: { description: group.description } })
          );
          // stores the services of the orders in the file uploaded
          let services = _.uniqBy(
            dataArray.services,
            service => service.description
          ); // deletes repeated services
          let promises_services = services.map(service =>
            Service.findOrCreate({
              where: { description: service.description }
            })
          );
          //set the orders to be stored in the db
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
                          Order.findOrCreate({
                            where: {
                              ref: order.ref,
                              attended: order.attended,
                              description: "Atendido"
                            }
                          }).then(([orderCreated, created]) => {
                            if (created) {
                              orderCreated.setClient(client);
                              orderCreated.setDoctor(doctor);
                              orderCreated.setGroup(group);
                              orderCreated.setService(service);
                              orderCreated.setOffice(office);
                              orderCreated.setFile(file);
                            }
                          })
                        )
                      )
                    )
                )
              );
            })
          );
          // run the promises from above
          await storeInDataBase(
            promises_file,
            promises_clients,
            promises_doctors,
            promises_groups,
            promises_offices,
            promises_services,
            promises_orders
          )
            .then(() => {
              const response = {
                error_code: 0,
                err_desc: null,
                data: fileName,
                message: "Se grabaron todos los datos"
              };
              res.status(201).json(response);
            })
            .catch(err => {
              //console.log("Error cargando datos : ", err);
              const response = {
                error_code: 1,
                err_desc: err,
                message: "No se grabaron todos los datos"
              };
              res.status(200).json(response);
            });
        }
      );
      try {
        // code to delete the file after the convertion and store of the data
        fs.unlinkSync(req.file.path);
      } catch (e) {
        //error deleting the file
      }
    } catch (e) {
      res.json({ error_code: 1, err_desc: "Corrupted excel file" });
    }
  });
});

module.exports = router;
