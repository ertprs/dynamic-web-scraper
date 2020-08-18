const puppeteer = require("puppeteer");

async function scrape(input) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(input.url, { waitUntil: "domcontentloaded" });

  let result = await page.evaluate((input) => {
    let attributes = {};
    input.data_name.forEach((attr, i) => {
      let str = document.querySelectorAll(input.selector_tag[i])[0].innerHTML
        ? document.querySelectorAll(input.selector_tag[i])[0].innerHTML
        : null;
      attributes[attr] = str.trim();
    });

    return attributes;
  }, input);

  await browser.close();
  return result;
}

module.exports = { scrape };
