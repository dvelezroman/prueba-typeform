const express = require('express');
const cors = require('cors'); // allow CORS
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
const routes = require('./routes');
const db = require('./models/db');
const seed = require('./seed');

const app = express();

app.use(cors());
app.options('/api/upload', cors());

require('./config/config'); // config.js

app.use(express.static(path.join(__dirname, '/../browser/build')));
app.use(express.static(path.resolve(`${__dirname}/../browser/public`)));
app.use(bodyParser.json({ limit: '10mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', routes);

app.use('/', function(req, res, next) {
	const indexFilePath = path.resolve(`${__dirname}/../browser/build/index.html`);
	res.sendFile(indexFilePath);
});

app.use((err, req, res, next) => {
	//console.log("Manejo el error: ", err);
	res.status(500).send(err);
});

db.sync({ force: false })
	.then(() =>
		app.listen(process.env.SERVER_PORT, () =>
			console.log(`Listening on PORT ${process.env.SERVER_PORT}`)
		)
	)
	.then(() => seed());
