var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // scrape().then((data) => console.log("Data", data));
  res.render("dashboard.index", { title: "Express", active: { dashboard: true } });
});

module.exports = router;
