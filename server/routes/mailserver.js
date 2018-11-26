const express = require("express");
const router = express.Router();
//const bcrypt = require("bcrypt");
const models = require("../models");
const { MailServer } = models;

router.get("/test", function(req, res) {
    res.status(200).json({ error: false, data: {}, msg: "Todo Bien..."})
});

// router.get("/:id", (req, res) => {
//     MailServer.findById(req.params.id).then(data => res.status(200).json({ error: false, data: data, msg: "Registro encontrado"}));
// });

router.put("/select/:id", (req, res) => 
    MailServer.update({ selected: true }, { where: { id: req.params.id }}).then(updated => res.status(201).json({ error: false, data: updated, msg: "Seleccionado" }))
);

router.put("/unselect/:id", (req, res) => 
    MailServer.update({ selected: false }, { where: { id: req.params.id }}).then(updated => res.status(201).json({ error: false, data: updated, msg: "Deseleccionado" }))
);

router.put("/delete/:id", (req, res) => {
    MailServer.destroy({ where: { id: req.params.id }}).then(data => {
        if (data) res.status(201).json({ error: false, data: data, msg: "Registro eliminado"});
        else res.status(200).json({ error: true, data: data, msg: "No existe registro"})   
    });
});

router.post("/", (req, res) => {
    let body = req.body;
    //console.log('body: ', body);
    MailServer.update({ selected: false }, { where: { } })
    .then(() => 
        MailServer.findOrCreate({ 
            where: {description: body.description },
            defaults: { service: body.service, host: body.host, port: body.port, secure: true, user: body.user, pass: body.pass, selected: true }
        }).then(([data, created]) => {
            if (created) res.status(201).json({ error: false, data: data, msg: "Se guardaron los datos" });
            else res.status(200).json({ error: true, data: data, msg: "No se guardaron los datos"});
        })
    );
});

router.get("/selected", (req, res) => {
    MailServer.findAll({ where: { selected: true }, order: [['id', 'ASC']]}).then(servers => {
        if (servers.length) res.status(200).json({ error: false, data: servers[0], msg: "Servidor activo encontrado"});
        else res.status(200).json({ error: true, data: {}, msg: "No se encontró servidor activo" })
    });
});

router.get("/", function(req, res) {
    MailServer.findAll({
        // Add order conditions here....
        order: [
            ['id', 'ASC']
        ]}).then(mailservers => res.status(200).json({ error: false, data: mailservers, msg: "OK"}));
});

module.exports = router;
