const express = require("express");
var fs = require("fs");
const router = express.Router();
const multer = require("multer");
const xlstojson = require("xls-to-json-lc");
const xlsxtojson = require("xlsx-to-json-lc");
const models = require("../models");

const Client = models.Client;
const Office = models.Office;
const Order = models.Order;
const Doctor = models.Doctor;
const Group = models.Group;
const Service = models.Service;

var storage = multer.diskStorage({
  //multers disk storage settings
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    var datetimestamp = Date.now();
    cb(
      null,
      file.fieldname +
        "-" +
        datetimestamp +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  }
});

var upload = multer({
  //multer settings
  storage: storage
}).single("file");

var upload = multer({
  //multer settings
  storage: storage,
  fileFilter: function(req, file, callback) {
    //file filter
    if (
      ["xls", "xlsx"].indexOf(
        file.originalname.split(".")[file.originalname.split(".").length - 1]
      ) === -1
    ) {
      return callback(new Error("Wrong extension type"));
    }
    callback(null, true);
  }
}).single("file");

const getDataInArrays = rawData => {
  let data = {
    clients: [],
    offices: [],
    orders: [],
    doctors: [],
    groups: [],
    services: []
  };
  rawData.map(reg => {
    data = Object.assign(
      {},
      {
        clients: [
          ...data.clients,
          { hcu: reg.hcu, email: reg.email, name: reg.paciente }
        ],
        offices: [...data.offices, { description: reg.sucursal }],
        orders: [...data.orders, { ref: reg.orden, attended: reg.fecha }],
        doctors: [...data.doctors, { name: reg.medico }],
        groups: [...data.groups, { description: reg.grupo }],
        services: [...data.services, { description: reg.servicio }]
      }
    );
  });
  return data;
};

const storeInDataBase = (
  pclients,
  poffices,
  porders,
  pdoctors,
  pgroups,
  pservices
) => {
  Promise.all([
    ...pclients,
    ...poffices,
    ...porders,
    ...pdoctors,
    ...pgroups,
    ...pservices
  ])
    .then(() => "Data was stored in the Database")
    .catch(err => "Error storing the data");
};
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
        function(err, result) {
          if (err) {
            return res.json({ error_code: 1, err_desc: err, data: null });
          }
          // here we must store in DataBase
          const dataArray = getDataInArrays(result);

          let promises_clients = dataArray.clients.map(client =>
            Client.findOrCreate({
              where: { hcu: client.hcu, name: client.name, email: client.email }
            })
          );

          let message = storeInDataBase(promises_clients, [], [], [], [], []);

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
