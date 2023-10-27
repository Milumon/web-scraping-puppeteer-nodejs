const db = require("../db");
const { createResponse } = require("../utils/createReponse");
const { TWELVE_HOURS_MS } = require("../utils/cronTime");
const { JSDOM } = require("jsdom"); 
const { validateURL } = require("../utils/validateURL");

exports.handler = async (event, context) => {
  let lastData = await db.fetchFromDB("questions", "");

  // If the last update is more than 12h old, update the file
  if (lastData == null || Date.now() - lastData.lastUpdate > TWELVE_HOURS_MS) {
    const questionsHTML = await db.fetchFromDB("questions", "loaders/");

    // Format the data

    const dataFormatted = [];

    questionsHTML.forEach((doc) => {
      const {
        window: { document },
      } = new JSDOM();

      const div = document.createElement("div");
      console.log(div)
      div.innerHTML = doc.docHTML;              
      const questionSubCategory = div.querySelector(
        ".bcp_titulo_subcategoria"
      ).innerHTML;
      const category = doc.category;
      const questionsDiv = div.querySelectorAll(".bcp_pregunta");

      questionsDiv.forEach((question) => {
        dataFormatted.push({
          question: question.innerHTML,
          questionSubCategory,
          category,
          urlAnswer: validateURL(question.href),
        });
      });
    });

    db.saveToDB("questions", "", dataFormatted);
    context.succeed(createResponse(200, dataFormatted));
  } else {
    context.succeed(createResponse(200, lastData));
  }
};
