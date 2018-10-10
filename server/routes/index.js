const router = require("express").Router();

router.use("/questions", require("./questions"));
router.use("/login", require("./login"));
router.use("/users", require("./users"));
router.use("/polls", require("./polls"));
router.use("/groups", require("./groups"));
router.use("/clients", require("./clients"));
router.use("/orders", require("./orders"));
router.use("/files", require("./files"));
router.use("/upload", require("./upload"));

router.use(function(req, res) {
  res.status(404).end();
});

module.exports = router;
