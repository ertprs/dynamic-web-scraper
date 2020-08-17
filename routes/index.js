var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");

async function scrape() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("http://quotes.toscrape.com/");

  let quotes = await page.evaluate(() => {
    let elements = Array.from(document.querySelectorAll(".quote"));

    return elements.map((element) => {
      return element.children[0].innerHTML;
    });
  });

  await browser.close();
  return quotes;
}

/* GET home page. */
router.get("/", function (req, res, next) {
  // scrape().then((data) => console.log("Data", data));
  res.render("index", { title: "Express" });
});

module.exports = router;
