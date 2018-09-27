const router = require("express").Router();

router.use("/questions", require("./questions"));
router.use("/users", require("./users"));
router.use("/polls", require("./polls"));
router.use("/upload", require("./upload"));

router.use(function(req, res) {
  res.status(404).end();
});

module.exports = router;
