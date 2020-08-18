const puppeteer = require("puppeteer");

async function scrape(input) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(input.url);
  let quotes = await page.evaluate((input) => {
    let title = document.querySelectorAll(input.selector_tag).innerHTML;

    let result = {
      title: title? title: null,
    };

    return result;
  }, input);

  await browser.close();
  return quotes;
}

module.exports = { scrape };
