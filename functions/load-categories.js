const db = require("../db");
const { createResponse } = require("../utils/createReponse");
const { TWELVE_HOURS_MS } = require("../utils/cronTime");
const { getOnlyText } = require("../utils/getOnlyText");
const { openPage } = require("../utils/openPage");

// Definir una constante para 12 horas en milisegundos

exports.handler = async (event, context) => {
  // Obtener los datos más recientes de la base de datos
  let lastData = await db.fetchFromDB("categories", "loaders/");

  if (lastData == null || Date.now() - lastData.lastUpdate > TWELVE_HOURS_MS) {
    // Realizar una solicitud web para obtener categorías
    await openPage(async (page) => {
      await page.goto("https://www.viabcp.com/ayuda-bcp");

      const categoriesHTML = await page.evaluate(() => {
        const categories = document.querySelector(
          ".bcp_contenedor_categorias"
        ).innerHTML;

        return {
          docHTML: categories,
        };
      });
      db.saveToDB("categories", "loaders/", categoriesHTML);
      context.succeed(createResponse(200, categoriesHTML));
    });
  } else {
    // Devolver los datos almacenados si no han pasado 12 horas
    context.succeed(createResponse(200, lastData));
  }
};
