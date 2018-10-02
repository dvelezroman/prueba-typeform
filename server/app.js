const express = require("express");
const cors = require("cors"); // allow CORS
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const routes = require("./routes");
const db = require("./models/db");

const app = express();

app.use(cors());
app.options("/api/upload", cors());
app.use(express.static(path.join(__dirname, "build")));
//app.use(express.static(path.resolve(`${__dirname}/../browser/public`)));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api", routes);

// app.get("/", function(req, res) {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

app.use("/", function(req, res, next) {
  const indexFilePath = path.resolve(`${__dirname}/build/index.html`);
  res.sendFile(indexFilePath);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err);
});

db.sync({ force: true }).then(() =>
  app.listen(3001, () => console.log("Listening on PORT 3001"))
);
