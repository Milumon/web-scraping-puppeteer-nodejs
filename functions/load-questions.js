const db = require("../db");
const { createResponse } = require("../utils/createReponse");
const { TWELVE_HOURS_MS } = require("../utils/cronTime");
const { openPage } = require("../utils/openPage");

exports.handler = async (event, context) => {
  let lastData = await db.fetchFromDB("questions", "/loaders");
  let categories = await db.fetchFromDB("categories", "");

  if (
    lastData == null ||
    Date.now() - lastData.lastUpdate > TWELVE_HOURS_MS
  ) {
    if (categories) {
      // visitar y obtener info de cada categoria y sus preguntas
      const scrapingQuestionsPromises = categories.map(async (category) => {
        return new Promise(async (resolve) => {
          await openPage(async (page) => {
            await page.goto('https://www.viabcp.com' + category.url);
            const questionsDiv = await page.evaluate(() => {
              return {
                docHTML: document.querySelector(".bcp_lista_preguntas").innerHTML,
              };
            });
            resolve({ ...questionsDiv, category: category.title });
          });
        });
      });

      // Utilizar Promise.all para ejecutar todas las solicitudes de forma paralela
      const questionsHTML = await Promise.all(scrapingQuestionsPromises);
      // Guardar en DB
      db.saveToDB("questions", "/loaders/", questionsHTML);

      return createResponse(200, questionsHTML);
    }
  } else {
    return createResponse(200, lastData);
  }
};
