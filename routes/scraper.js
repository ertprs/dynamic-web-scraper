var express = require("express");
var router = express.Router();
const Scraper = require("../lib/Scraper");

router.get("/", function (req, res, next) {
  res.render("dashboard/scraper/index", { title: "Scraper" });
});

router.post("/", function (req, res, next) {
  let input = {
    url: req.body.url,
    data_name: req.body.data_name,
    selector_tag: req.body.selector_tag,
  };

  let quotes = Scraper.scrape(input).then((res) => {
    console.log(res);
  });
  res.send("ok");
  // res.render("dashboard/scraper/index", { title: "Scraper" });
});

module.exports = router;
