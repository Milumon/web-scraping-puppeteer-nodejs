const db = require("../db");
const { createResponse } = require("../utils/createReponse");
const { TWELVE_HOURS_MS } = require("../utils/cronTime");
const { JSDOM } = require("jsdom");
const replaceMark = require("../utils/replaceMark");

exports.handler = async (event, context) => {
  const { category } = event.queryStringParameters ;
  //.toLowerCase()
  const lowCategory = category.toLowerCase();

  let lastData = await db.fetchFromDB("answers-" + lowCategory, "answers/");

  if (!lowCategory || lowCategory === "") {
    return context.succeed(
      createResponse(400, { error: "No se ha enviado una categoría" })
    );
  }

  // If the last update is more than 12h old, update the file
  if (lastData == null || Date.now() - lastData.lastUpdate > TWELVE_HOURS_MS) {
    const answersHTML = await db.fetchFromDB(
      "answers-" + lowCategory,
      "loaders/answers/"
    );

    // asegurarme que la data ha sido precargada
    if (!answersHTML) {
      return context.succeed(
        createResponse(400, {
          error: "Launch the loader for this category first",
        })
      );
    }

    // asegurarme que el category exista
    const categoryExists = answersHTML.find(
      (item) => replaceMark(item.category.toLowerCase()) === lowCategory
    );
    if (!categoryExists) {
      return context.succeed(
        createResponse(400, { error: "La categoría enviada no existe" })
      );
    }
    // Format the data
    const dataFormatted = [];

    answersHTML.forEach((doc) => {
      const answerCleaned = doc.docHTML.replace(/\s+/g, " ");
      dataFormatted.push({
        answer: answerCleaned,
        question: doc.question,
        questionSubCategory: doc.questionSubCategory,
        category: doc.category,
        urlAnswer: doc.urlAnswer,
      });
    });

    db.saveToDB("answers-" + lowCategory, "answers/", dataFormatted);
    context.succeed(createResponse(200, dataFormatted));
  } else {
    context.succeed(createResponse(200, lastData));
  }
};
