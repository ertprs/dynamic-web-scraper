var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");
const Scraper = require("../utils/Scraper");
const ObjectID = require("bson").ObjectID;
const fs = require("fs");

router.get("/detikcom", function (req, res, next) {
  // scrape().then((data) => console.log("Data", data));
  res.render("dashboard/sites/detikcom/index", {
    layout: "dashboard/layouts/master",
    title: "Detik.com",
    active: { sites_detikcom: true },
  });
});

// router.post("/detikcom/content/index", async function (req, res, next) {

// })

router.post("/detikcom/indeks", async function (req, res, next) {
  let input = {
    url: "https://news.detik.com",
    date: req.body.date,
    sub_channel: req.body.sub_channel,
    page: req.body.page ? `${req.body.page}` : ``,
  };
  console.log(input);
  let _strDate = input.date.split("-");
  let strDate = "";
  if (_strDate.length == 3) {
    let str = _strDate[1] + "/" + _strDate[2] + "/" + _strDate[0];
    strDate = encodeURIComponent(str);
  } else {
    strDate = input.date;
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      `${input.url}${input.sub_channel}/indeks${input.page}?date=${strDate}`,
      {
        waitUntil: "domcontentloaded",
      }
    );
    console.log(
      `${input.url}${input.sub_channel}/indeks${input.page}?date=${strDate}`
    );
    input.url = `${input.url}${input.sub_channel}/indeks${input.page}?date=${strDate}`;
    // .pagination__item
    let _pages = await page.$$eval(".pagination__item", (pages) =>
      pages.map((page) => page.innerHTML)
    );
    // input.pages = _pages;
    // console.log(parseInt(_pages[0]))
    let arrPages = [];
    _pages.forEach((el) => {
      if (!/\D/.test(el)) arrPages.push(parseInt(el));
    });
    input.pages = arrPages;
    // console.log(input.pages)
    // console.log(Math.max(...input.pages))
    let attributes = {};
    let _content_links = await page.$$eval(
      ".list-content a.media__link",
      (hrefs) => hrefs.map((link) => link.href)
    );

    let _content_titles = await page.$$eval(
      ".list-content a.media__link span img",
      (titles) => titles.map((title) => title.getAttribute("title"))
    );

    let content_dates = await page.$$eval(
      ".list-content .media__date span",
      (dates) => dates.map((date) => date.getAttribute("title"))
    );

    let content_links = _content_links.filter((v, i, a) => a.indexOf(v) === i);
    console.log(content_links.length + " contents found.");
    let content_titles = _content_titles.filter(
      (v, i, a) => a.indexOf(v) === i
    );

    await browser.close();
    return res.send({
      isError: false,
      stsCode: 200,
      input: input,
      content_links: content_links,
      content_titles: content_titles,
      content_dates: content_dates,
    });
  } catch (error) {
    console.log(error);
    res.send({
      isError: true,
      stsCode: 500,
      msg: "Someting went wrong, can not scrape the page.",
      errMsg: error.message,
    });
  }
});


// TODO: make a zip file downloadable features


router.post("/detikcom/scrape", async function (req, res, next) {
  let input = null;
  if (req.body.extraction_type == "default") {
    input = {
      url: req.body.url,
      attribute: [ 'Judul', 'Author', 'Tanggal', 'Detail' ],
      selector: [ 'h1', 'detail__author', 'detail__date', 'p' ],
      selector_type: [ 'tag', 'class', 'class', 'tag' ],
      selector_traversal_type: [ 'first', 'first', 'first', 'all' ]
    };
  } else {
    input = {
      url: req.body.url,
      attribute: req.body.attribute,
      selector: req.body.selector,
      selector_type: req.body.selector_type,
      selector_traversal_type: req.body.selector_traversal_type,
    };
  }
  console.log(input);

  try {
    let result = await Scraper.scrape(input);
    let objectId = new ObjectID();

    console.log(result);
    let logger = fs.createWriteStream(__dirname + "/" + objectId + ".owl", {
      flags: "w", // 'a' means appending (old data will be preserved)
    });
    let str = `<?xml version="1.0"?>
<rdf:RDF 
xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
xmlns:rdf="${input.url}">
  
<rdf:Description rdf:about="${result["scraped_page_title"]}"`;

    for (let i = 0; i < input.attribute.length; i++) {
      str += `\n<artikel:${input.attribute[i]}>${
        result[input.attribute[i]]
      }</artikel:${input.attribute[i]}>`;
    }
    logger.write(str); // append string to your file
    logger.end();
    // TODO: Saving data to db for records

    return res.send({
      objectId: objectId,
      isError: false,
      stsCode: 200,
      result: str,
      pageTitle: result["scraped_page_title"],
    });
  } catch (error) {
    return res.send({
      isError: true,
      stsCode: 500,
      msg: "Someting went wrong, can not scrape the page.",
      errMsg: error.message,
    });
  }
});

module.exports = router;
