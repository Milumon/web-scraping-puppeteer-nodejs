import puppeteer from "puppeteer";

async function openWebPage() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 200,
  });

  try {
    const page = await browser.newPage();
    await page.goto("https://www.viabcp.com/ayuda-bcp");

    await page.waitForSelector(".bcp_btn_aceptar", { visible: true });
    await page.click(".bcp_btn_aceptar");
 
    
    const categoriesAll = await page.evaluate(() => {
        const categories = Array.from(document.querySelectorAll(".bcp_contenedor_categorias>div"));
      
        return categories.map((category) => {
          return {
            title: category.querySelector(".titulo_categoria").innerHTML,
            url: category.querySelector(".bcp_boton_conoce_mas").href
          };
        });
      });
      

    

    console.log(categoriesAll)

    // visit categories and get questions
  } catch (e) {
    console.log(e);
  } finally {
    await browser.close();
  }
}

openWebPage();
