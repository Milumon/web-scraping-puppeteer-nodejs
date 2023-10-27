const { createResponse } = require("../utils/createReponse");

exports.handler = async (event, context) => {
  const routes = {
    answers: [
      {
        path: "/answers?category=Banca%20Movil",
      },
      {
        path: "/answers?category=Operaciones%20digitales",
      },
      {
        path: "/answers?category=Tarjetas%20de%20Credito",
      },
      {
        path: "/answers?category=Prestamos",
      },
      {
        path: "/answers?category=Ahorros",
      },
      {
        path: "/answers?category=Adelanto%20de%20Sueldo",
      },
      {
        path: "/answers?category=Seguros",
      },
    ],
    loaders: [
        {
            path: "/load-answers?category=Banca%20Movil",
        },
        {
            path: "/load-answers?category=Operaciones%20digitales",
        },
        {
            path: "/load-answers?category=Tarjetas%20de%20Credito",
        },
        {
            path: "/load-answers?category=Prestamos",
        },
        {
            path: "/load-answers?category=Ahorros",
        },
        {
            path: "/load-answers?category=Adelanto%20de%20Sueldo",
        },
        {
            path: "/load-answers?category=Seguros",
        },
        {
            path: "/load-categories",
        },
        {
            path: "/load-questions",
        }
    ]
  };


  context.succeed(createResponse(200, routes));
};
