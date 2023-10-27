const { getBrowser } = require("./getBrowser");

async function openPage(callback) {
  let browser;
  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await callback(page);
  } finally {
    await browser?.close();
  }
}

module.exports = { openPage };
