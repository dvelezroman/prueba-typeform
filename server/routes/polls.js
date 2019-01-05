const express = require("express");
const nodemailer = require("nodemailer");
const Promise = require("bluebird");
const uuid = require("uuid");
const router = express.Router();
const Sequelize = require("sequelize");
const _ = require("lodash");
const Op = Sequelize.Op;
const path = require("path");
const models = require("../models");
const Group = models.Group;
const Poll = models.Poll;
const Question = models.Question;
const PollsSend = models.PollsSend;
const File = models.File;
const Office = models.Office;
const Client = models.Client;
const Answer = models.Answer;
const Order = models.Order;
const { html } = require("./html/email");

router.get("/test", (req, res) => {
	res.status(200).json("OK");
});

router.get("/sendpolls/from/:from/to/:to", (req, res) => {
	let from = req.params.from;
	let to = req.params.to;
	//console.log("From: ", from, ", to: ", to);
	PollsSend.findAll({
		where: {
			createdAt: {
				[Op.between]: [from, to]
			}
		},
		include: [
			{
				model: Poll,
				include: [Question, Group]
			},
			{
				model: File
			}
		]
	})
		.then(polls => res.status(200).json(polls))
		.catch(err => res.status(200).json({ error: true, data: err }));
});

router.get("/sendpolls", (req, res, next) => {
	// obtiene las encuestas que han sido enviadas a  correos
	PollsSend.findAll({
		include: [{ model: Poll, include: [Group] }, { model: File }]
	})
		.then(polls => res.status(200).json(polls))
		.catch(err => res.status(404).json(err));
});

router.get("/answers/:question_ref", (req, res) => {
	let question_ref = req.params.question_ref;
	//console.log("Pollsends : ", question_ref);
	// obtener las respuestas de todas las pollsend que pertenecen a una question_ref
	Answer.findAll({
		attributes: [
			"id",
			"type",
			"value",
			"createdAt",
			"office",
			"ref",
			"attended"
		],
		include: [
			{ model: PollsSend, include: [{ model: Poll, include: [Question] }] },
			{ model: Client }
		]
	}).then(items => {
		let answers = [];
		//console.log("Items : ", items);
		items.forEach(item => {
			if (item.pollsend.poll.question.question_ref === question_ref) {
				answers.push(item);
			}
		});
		res.status(200).json(answers);
	});
});

router.post("/sendpolls", (req, res) => {
	// actualiza el numero de answers para una encuesta
	let answers = req.body.answers; // recibe el numero de respuestas para una encuesta
	let ref = req.body.ref; // recibe el ref de la encuesta para poder buscarla y actualizarle el numero de respuestas
	let average = 0;
	//console.log('Answers: ', answers[0].answers[0].number);
	let len = 0;
	if (answers.length) {
		let sum = 0;
		len = 0;
		answers.forEach(element => {
			//console.log('answer', element.answers[0])
			if (element.answers && element.answers[0].type === "number") {
				len++;
				sum = sum + element.answers[0].number;
			} else if (element.answers && element.answers[0].type === "boolean") {
				// hay que poner que lleve los si y no, y las multiple decisiones
				len++;
				sum = element.answers[0].boolean ? sum + 1 : sum;
			} else {
				len++;
				sum = sum + 1;
			}
		});
		average = sum / len;
	}
	//console.log('Average: ', average);
	Poll.findOne({ where: { ref: ref } })
		.then(poll =>
			PollsSend.update(
				{ answers: len, average: average },
				{ where: { pollId: poll.id } }
			)
		)
		.then(() => res.status(201).json({ error: false, msg: "updated" }));
});

// sends email to a group of emails belonging a one category
router.post("/send", async (req, res, next) => {
	//console.log("Params: ", req.body.array);
	let params = req.body.array;
	// aqui va la accion de enviar mail con gmail
	let ref = uuid(); // genero un ref
	let question_ref = params.ref;
	let server = req.body.server;
	let days = req.body.days;
	//console.log("Clientes: ", params.clients);
	let emails = params.clients.map(item => item.email);
	let file = params.fileId;
	let names = params.clients.map(item => item);
	let url = params.url;
	let subject = params.subject;
	let greet = params.greet;
	let question = {
		title: params.title,
		description: params.description,
		type: params.type,
		scale: params.scale,
		choices: params.choices,
		shape: params.shape,
		allow_multiple_selection: params.allow_multiple_selection
	};
	//console.log('Clientes : ', names);
	//console.log('Body listo: ', poll_html);
	let smtpTransport = null;
	if (server.service !== "Otro") {
		smtpTransport = nodemailer.createTransport({
			service: server.service,
			auth: {
				user: server.user,
				pass: server.pass
			}
		});
	} else {
		smtpTransport = nodemailer.createTransport({
			host: server.host,
			port: server.port,
			secure: true,
			auth: {
				user: server.user,
				pass: server.pass
			},
			tls: {
				rejectUnauthorized: false
			}
		});
	}
	//console.log('Server: ', smtpTransport);
	let poll_html = "";
	let mail = "";
	let mail_success = [];
	let mail_unsuccess = [];
	//console.log("Names : ", names);
	for (let i = 0; i < names.length; i++) {
		poll_html = html(ref, question, names[i]); // tengo que enviarle la pregunta, url, y el cliente
		mail = {
			from: `Servicio al Cliente - Medilink S.A. ${server.user}`, // aqui cambiar el correo del remitente
			to: names[i].email,
			subject: `${subject}`,
			html: poll_html
		};
		smtpTransport.sendMail(mail, (err, response) => {
			mail_success.push({ client: names[i], form: url });
		});
	}
	Poll.update(
		{ send: true },
		{ returning: true, where: { ref: question_ref } }
	).then(([rowsUpdate, [updatedPoll]]) => {
		if (updatedPoll) {
			let time = new Date();
			// aqui cambiar por la selección que haga del tiempo de vida de la encuesta
			time = time.getTime() + days * (24 * (1000 * 60 * 60));
			PollsSend.create({
				ref,
				sendtime: time,
				clients: emails.length,
				answers: 0
			}).then(sendPoll => {
				sendPoll.setPoll(updatedPoll);
				File.findById(file).then(file => {
					sendPoll.setFile(file);
				});
			});
		}
		res
			.status(201)
			.json({ error: false, mail_success, mail_unsuccess, msg: "OK" });
	});
});

router.post("/new", function(req, res, next) {
	//console.log('PollData: ', req.body);
	let question = req.body.poll;
	let ref = req.body.ref;
	let groupId = req.body.group;
	let url = req.body.url;
	Group.findOne({ where: { id: Number(groupId) } }).then(group =>
		Poll.create({
			ref: ref,
			url: url,
			name: question.subject,
			subject: question.subject,
			greet: question.greet
		}).then(poll =>
			Question.findOne({ where: { ref: ref } }).then(question => {
				poll.setGroup(group);
				poll.setQuestion(question);
				//poll.setFile(file);
				res.status(201).json(poll);
			})
		)
	);
});

router.get(
	"/answer/:poll_id/:hcu/data/:value/office/:office/order/:order",
	(req, res) => {
		// registrar respuestas
		let params = req.params;
		//console.log("Params: ", params);
		const successFilePath = path.resolve(
			path.join(`${__dirname}/html/success.html`)
		);
		const unsuccessFilePath = path.resolve(
			path.join(`${__dirname}/html/unsuccess.html`)
		);
		const votedFilePath = path.resolve(
			path.join(`${__dirname}/html/voted.html`)
		);
		const errorFilePath = path.resolve(
			path.join(`${__dirname}/html/error.html`)
		);
		// primero verificar si la encuesta aun está activa
		let today = new Date(); // durante dos días la encuesta esta activa
		PollsSend.findOne({ where: { ref: params.poll_id } }).then(
			async pollsend => {
				if (!pollsend) res.sendFile(errorFilePath);
				// la encuesta no existe
				else {
					if (pollsend.sendtime > today) {
						// la encuesta está activa
						//console.log('Encuesta está activa');
						let client = await Client.findOne({
							where: { hcu: params.hcu }
						}).then(client => client);
						let poll = await Poll.findOne({
							where: { id: pollsend.pollId }
						}).then(poll => poll);
						let question = await Question.findOne({
							where: { ref: poll.ref }
						}).then(question => question);
						//console.log("Question : ", question);
						Answer.findOrCreate({
							where: {
								clientId: client.id,
								pollsendId: pollsend.id
								//ref: params.order
							},
							defaults: {
								type: question.type,
								value: params.value,
								office: params.office,
								ref: params.order
							}
						}).then(([answer, created]) => {
							//console.log('Created: ', created);
							if (!created) res.sendFile(votedFilePath);
							//Answer.create({ type: question.type, value: params.value }).then(answer => {
							// client.setAnswers(answer);
							// pollsend.setResps(answer);
							else res.sendFile(successFilePath);
						});
					} else {
						// la encuesta ya no está activa
						//console.log("Encuesta ya no está activa");
						res.sendFile(unsuccessFilePath);
					}
					//console.log('Poll: ', pollsend);
				}
			}
		);
		// logica para registrar la respuesta de la encuesta,
		//res.status(201).json({ error: false, data: { poll_id: params.poll_id, value: params.value }, msg: 'Respuesta registrada'})
	}
); // recibe las respuestas de las encuestas enviadas

router.get("/", function(req, res) {
	Poll.findAll({ include: [Group] })
		.then(polls => res.status(200).json(polls))
		.catch(err => res.status(200).json(err));
});

module.exports = router;
