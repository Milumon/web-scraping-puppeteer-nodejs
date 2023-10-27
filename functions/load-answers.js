const db = require("../db");
const { createResponse } = require("../utils/createReponse");
const { openPage } = require("../utils/openPage");
const { TWELVE_HOURS_MS } = require("../utils/cronTime");
const replaceMark = require("../utils/replaceMark");

exports.handler = async (event, context) => {
  try {
    const { category } = event.queryStringParameters;
    //.toLowerCase()
    const lowCategory = replaceMark(category.toLowerCase());
    // cargar ultima consulta
    let lastData = await db.fetchFromDB(
      "answers-" + lowCategory,
      "loaders/answers/"
    );
    // cargar preguntas
    let questions = await db.fetchFromDB("questions", ""); 

    if (!lowCategory || lowCategory === "") {
      return context.succeed(
        createResponse(400, { error: "No se ha enviado una categoría" })
      );
    }

    // asegurarme que el category exista
    const categoryExists = questions.find(
      (item) => replaceMark(item.category.toLowerCase()) === lowCategory
    );

    console.log('categoryExists',categoryExists)
    if (!categoryExists) {
      return context.succeed(
        createResponse(400, { error: "La categoría enviada no existe" })
      );
    }

    // Filtrar preguntas por la categoría deseada
    questions = questions.filter((item) => {
      return replaceMark(item.category.toLowerCase()) === lowCategory;
    });

    // Si la última actualización es mayor a 12h, actualizar el archivo
    if (
      lastData == null ||
      Date.now() - lastData.lastUpdate > TWELVE_HOURS_MS
    ) {
      
      if (questions) {
        // visitar web y obtener info de cada pregunta y sus rptas
        console.log(questions)
        const scrapingAnswerPromises = questions.map(async (question) => {
          return new Promise(async (resolve) => {
            await openPage(async (page) => {
              await page.goto(question.urlAnswer);
              const answersDiv = await page.evaluate(() => {
                const elements = document.querySelectorAll(
                  ".bcp_texto_enriquecido_formateado"
                );
                const allText = Array.from(elements)
                  .map((el) => el.textContent)
                  .join("\n");

                return {
                  docHTML: allText,
                };
              });
              resolve({ ...answersDiv, ...question });
            });
          });
        });

        // Utilizar Promise.all para ejecutar todas las solicitudes de forma paralela
        const answersHTML = await Promise.all(scrapingAnswerPromises);
        console.log('AAAAAAAAANSWE',answersHTML);
        // Guardar en DB
        db.saveToDB("answers-" + lowCategory, "loaders/answers/", answersHTML);

        return createResponse(200, answersHTML);
      }
    } else {
      console.log(lastData);
      return createResponse(200, lastData);
    }
  } catch (error) {
    return createResponse(500, error);
  }
};
