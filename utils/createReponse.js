function createResponse(status, data) {
  return {
    statusCode: status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(data),
  };
}

module.exports = { createResponse };
