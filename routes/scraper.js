var express = require("express");
var router = express.Router();

router.get("/", function (req, res, next) {
  res.render("dashboard/scraper/index", { title: "Scraper" });
});

router.post("/", function (req, res, next) {
  let url = req.body.url;
  let data_name = req.body.data_name;
  let selector_tag = req.body.selector_tag;
  console.log(url);
  console.log(data_name);
  console.log(selector_tag);
  res.send("ok");
  // res.render("dashboard/scraper/index", { title: "Scraper" });
});

module.exports = router;
