// es la respuesta a cada solicitud http

exports.jsonResponse = function (statuscode, body) {
  return {
    statuscode,
    body: body,
  };
};
