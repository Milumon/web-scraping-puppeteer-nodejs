const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-core");
const { getOnlyText } = require("../utils/getOnlyText");
const dotenv = require("dotenv");

dotenv.config();

exports.handler = async (event, context) => {
  const browser = await puppeteer.launch({
    args: chromium.args,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || await chromium.executablePath(),
    headless: true,
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.viabcp.com/ayuda-bcp"); 

    // we can't use functions not defined inside the evaluate
    const categoriesAll = await page.evaluate(() => {
      const categories = Array.from(
        document.querySelectorAll(".bcp_contenedor_categorias>div")
      );

      return categories.map((category) => {
        const title = category.querySelector(".titulo_categoria").innerHTML;
        const url = category.querySelector(".bcp_boton_conoce_mas").href;

        return {
          title,
          url,
        };
      });
    });
    await browser.close();

    const cleanedCategoriesAll = categoriesAll.map((category) => {
      return {
        title: getOnlyText(category.title),
        url: category.url,
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(cleanedCategoriesAll),
    };
    // visit categories and get questions
  } catch (e) {
    console.log(e);
  }  
};
