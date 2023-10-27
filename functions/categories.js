const dotenv = require("dotenv");
const db = require("../db");
const { createResponse } = require("../utils/createReponse");
const { TWELVE_HOURS_MS } = require("../utils/cronTime");
const { JSDOM } = require("jsdom");
const { getOnlyText } = require("../utils/getOnlyText");

exports.handler = async (event, context) => {
  let lastData = await db.fetchFromDB("categories", "");

  // If the last update is more than 12h old, update the file
  if (lastData == null || Date.now() - lastData.lastUpdate > TWELVE_HOURS_MS) {
    const categoriesHTML = await db.fetchFromDB("categories", "loaders/");
    if (categoriesHTML.docHTML) {
      const {
        window: { document },
      } = new JSDOM();
      const div = document.createElement("div");
      div.innerHTML = categoriesHTML.docHTML;
      const categoryElements = div.querySelectorAll(".box_categoria");

      // Format the data

      const dataFormatted = [];

      categoryElements.forEach((category) => {
        const categoryTitle =
          getOnlyText(category.querySelector(".titulo_categoria").innerHTML);
        const categoryURL = category.querySelector(
          ".bcp_boton_conoce_mas"
        ).href;
        dataFormatted.push({
          title: categoryTitle,
          url: categoryURL,
        });
      }); 
      db.saveToDB("categories", "", dataFormatted);
      context.succeed(createResponse(200, dataFormatted));
    }
  } else {
    context.succeed(createResponse(200, lastData));
  }
};
