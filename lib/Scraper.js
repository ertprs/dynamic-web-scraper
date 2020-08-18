const puppeteer = require("puppeteer");

async function scrape(input) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(input.url, { waitUntil: "domcontentloaded" });

  let result = await page.evaluate((input) => {
    let attributes = {};
    input.attribute.forEach((attr, i) => {
      let selector = input.selector_type[i];

      switch (input.selector_type[i]) {
        case "tag":
          selector = input.selector[i];
          break;

        case "class":
          selector = "." + input.selector[i];
          break;

        default:
          break;
      }

      let str =
        document.querySelectorAll(selector).length > 0
          ? document.querySelectorAll(selector)[0].innerHTML
          : null;
      attributes[attr] = str ? str.trim() : str;
    });

    return attributes;
  }, input);

  await browser.close();
  return result;
}

module.exports = { scrape };
