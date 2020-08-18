var express = require("express");
var router = express.Router();
const Scraper = require("../lib/Scraper");

router.get("/", function (req, res, next) {
  res.render("dashboard/scraper/index", {
    title: "Scraper",
    active: { scraper: true },
  });
});

router.post("/", async function (req, res, next) {
  let input = {
    url: req.body.url,
    data_name: req.body.data_name,
    selector_tag: req.body.selector_tag,
  };
  console.log(input);

  let result = await Scraper.scrape(input)
  console.log(result)
  let str = `
  <?xml version="1.0"?>
  <rdf:RDF 
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
  xmlns:rdf="${input.url}">
  
  <rdf:Description rdf:about="Artikel berita"`
  for (let i = 0; i < input.data_name.length; i++) {
    str += `\n<artikel:${input.data_name[i]}>${result[input.data_name[i]]}</artikel:${input.data_name[i]}>`
  }
  res.send(str)
});

module.exports = router;
