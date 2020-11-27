var express = require("express");
var router = express.Router();
const puppeteer = require("puppeteer");
const Scraper = require("../utils/Scraper");
const ObjectID = require("bson").ObjectID;
const Scrape = require("../../models/Scrape");
var easyzip = require('easy-zip');

router.get("/detikcom", function (req, res, next) {
  // scrape().then((data) => console.log("Data", data));
  res.render("dashboard/sites/detikcom/index", {
    layout: "dashboard/layouts/master",
    title: "Detik.com",
    active: {
      sites_detikcom: true
    },
  });
});

// router.post("/detikcom/content/index", async function (req, res, next) {

// })

router.get("/detikcom/indeks/zip", async function (req, res, next) {
  // Dapatkan link kemudian ekstrak data untuk setiap halaman
  // TODO: tandapa indexing terlebih dahulu, jadi langsung scrape per halaman
  try {
    // Siapkan zip
    var zip2 = new easyzip.EasyZip();
    var jsFolder = zip2.folder('data');
    // Proses indexing halaman
    let input = req.query;
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      `${req.query.url}`, {
        waitUntil: "domcontentloaded",
      }
    );
    console.log(
      `${req.query.url}`
    );
    input.url = `${req.query.url}`;
    // .pagination__item
    let _pages = await page.$$eval(".pagination__item", (pages) =>
      pages.map((page) => page.innerHTML)
    );
    let arrPages = [];
    _pages.forEach((el) => {
      if (!/\D/.test(el)) arrPages.push(parseInt(el));
    });
    input.pages = arrPages;
    let _content_links = await page.$$eval(
      ".list-content a.media__link",
      (hrefs) => hrefs.map((link) => link.href)
    );

    let content_links = _content_links.filter((v, i, a) => a.indexOf(v) === i);
    console.log(content_links.length + " contents found.");
    await browser.close();
    // Proses scraping per halaman
    let _input = null;
    for (const link of content_links) {
      _input = {
        url: link,
        attribute: ['Judul', 'Author', 'Tanggal', 'Detail'],
        selector: ['h1', 'detail__author', 'detail__date', 'p'],
        selector_type: ['tag', 'class', 'class', 'tag'],
        selector_traversal_type: ['first', 'first', 'first', 'all']
      };
      let result = await Scraper.scrape(_input);
      let objectId = new ObjectID().toString();
      console.log("result scraped.");
      let strXML = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
  xmlns:dc="${_input.url}">
  
  <rdf:Description rdf:about="${result["scraped_page_title"]}">`;

      for (let i = 0; i < _input.attribute.length; i++) {
        strXML += `\n<dc:${_input.attribute[i].replace(/\s/g, "-")}>${
        result[_input.attribute[i]]
      }</dc:${_input.attribute[i].replace(/\s/g, "-")}>`;
      }
      strXML += `
    </rdf:Description>
  </rdf:RDF>`;
      jsFolder.file(`${result["scraped_page_title"]}.owl`, strXML);
      let arrContentJson = [];
      for (let i = 0; i < _input.attribute.length; i++) {
        arrContentJson.push({
          name: _input.attribute[i].replace(/\s/g, "-"),
          value: result[_input.attribute[i]]
        });
      }

      const scrape = await Scrape.findOne({
        where: {
          page_title: result["scraped_page_title"]
        }
      });
      if (scrape === null) {
        let arrAttrs = []
        for (let i = 0; i < _input.attribute.length; i++) {
          arrAttrs.push({
            name: _input.attribute[i].replace(/\s/g, "-"),
            selectors: {
              name: _input.selector[i],
              type: _input.selector_type[i],
              traversal_type: _input.selector_traversal_type[i],
            }
          })
        }
        let newScrape = await Scrape.create({
          code: objectId,
          url: _input.url,
          page_title: result["scraped_page_title"],
          content: JSON.stringify({
            xml: strXML,
            json: {
              url: _input.url,
              title: result["scraped_page_title"],
              attributes: arrContentJson
            }
          }),
          // user_id: req.session.userInfo.id
          user_id: 1,
          attributes: JSON.stringify(arrAttrs),
        }).catch((err) => {
          console.log("errMsg:", err);
        });

      } else {
        objectId = scrape.code;
        let arrAttrs = []
        for (let i = 0; i < _input.attribute.length; i++) {
          arrAttrs.push({
            name: _input.attribute[i].replace(/\s/g, "-"),
            selectors: {
              name: _input.selector[i],
              type: _input.selector_type[i],
              traversal_type: _input.selector_traversal_type[i],
            }
          })
        }
        Scrape.update({
          url: _input.url,
          page_title: result["scraped_page_title"],
          content: JSON.stringify({
            xml: strXML,
            json: {
              url: _input.url,
              title: result["scraped_page_title"],
              attributes: arrContentJson
            }
          }),
          // user_id: req.session.userInfo.id
          user_id: 1,
          attributes: JSON.stringify(arrAttrs)
        }, {
          where: {
            page_title: result["scraped_page_title"]
          }
        });
      }
    }
    zip2.writeToResponse(res, `data-${req.query.title}`);
    return res.end();
  } catch (error) {
    return res.send({
      isError: true,
      stsCode: 500,
      msg: "Someting went wrong, can not scrape the page.",
      errMsg: error.message,
    });
  }

  // jsFolder.file('app.js', 'alert("hello world")');
  // var data = "<html><body><h1>Inside new Html</h1></body></html>";
  // jsFolder.file('index.html', data);
  // console.log(req.query);
  // zip2.writeToResponse(res, `data-${req.query.title}`);
  // res.end();
});

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
    input.tanggal = _strDate[1] + "-" + _strDate[2] + "-" + _strDate[0];
    strDate = encodeURIComponent(str);
  } else {
    input.tanggal = input.date.replace(/\//g, "-");
    strDate = input.date;
  }

  try {
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(
      `${input.url}${input.sub_channel}/indeks${input.page}?date=${strDate}`, {
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
      attribute: ['Judul', 'Author', 'Tanggal', 'Detail'],
      selector: ['h1', 'detail__author', 'detail__date', 'p'],
      selector_type: ['tag', 'class', 'class', 'tag'],
      selector_traversal_type: ['first', 'first', 'first', 'all']
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
    let objectId = new ObjectID().toString();
    console.log(result);
    let strXML = `<?xml version="1.0"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" 
  xmlns:dc="${input.url}">
  
  <rdf:Description rdf:about="${result["scraped_page_title"]}">`;

    for (let i = 0; i < input.attribute.length; i++) {
      strXML += `\n<dc:${input.attribute[i].replace(/\s/g, "-")}>${
        result[input.attribute[i]]
      }</dc:${input.attribute[i].replace(/\s/g, "-")}>`;
    }
    strXML += `
    </rdf:Description>
  </rdf:RDF>`;

    let arrContentJson = [];
    for (let i = 0; i < input.attribute.length; i++) {
      arrContentJson.push({
        name: input.attribute[i].replace(/\s/g, "-"),
        value: result[input.attribute[i]]
      });
    }

    const scrape = await Scrape.findOne({
      where: {
        page_title: result["scraped_page_title"]
      }
    });
    if (scrape === null) {
      let arrAttrs = []
      for (let i = 0; i < input.attribute.length; i++) {
        arrAttrs.push({
          name: input.attribute[i].replace(/\s/g, "-"),
          selectors: {
            name: input.selector[i],
            type: input.selector_type[i],
            traversal_type: input.selector_traversal_type[i],
          }
        })
      }
      let newScrape = await Scrape.create({
        code: objectId,
        url: input.url,
        page_title: result["scraped_page_title"],
        content: JSON.stringify({
          xml: strXML,
          json: {
            url: input.url,
            title: result["scraped_page_title"],
            attributes: arrContentJson
          }
        }),
        // user_id: req.session.userInfo.id
        user_id: 1,
        attributes: JSON.stringify(arrAttrs),
      }).catch((err) => {
        console.log("errMsg:", err);
      });

    } else {
      objectId = scrape.code;
      let arrAttrs = []
      for (let i = 0; i < input.attribute.length; i++) {
        arrAttrs.push({
          name: input.attribute[i].replace(/\s/g, "-"),
          selectors: {
            name: input.selector[i],
            type: input.selector_type[i],
            traversal_type: input.selector_traversal_type[i],
          }
        })
      }
      Scrape.update({
        url: input.url,
        page_title: result["scraped_page_title"],
        content: JSON.stringify({
          xml: strXML,
          json: {
            url: input.url,
            title: result["scraped_page_title"],
            attributes: arrContentJson
          }
        }),
        // user_id: req.session.userInfo.id
        user_id: 1,
        attributes: JSON.stringify(arrAttrs)
      }, {
        where: {
          page_title: result["scraped_page_title"]
        }
      });
    }

    return res.send({
      objectId: objectId,
      isError: false,
      stsCode: 200,
      result: strXML,
      pageTitle: result["scraped_page_title"],
    });
  } catch (error) {
    return res.send({
      isError: true,
      stsCode: 500,
      msg: "Oops, terjadi kesalahan. Coba beberapa saat lagi.",
      errMsg: error.message,
    });
  }
});

module.exports = router;