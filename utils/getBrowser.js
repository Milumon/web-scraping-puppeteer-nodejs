const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");

async function getBrowser() {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath()),
    headless: true,
  });
  return browser;
}

module.exports = { getBrowser };