const jwt = require("jsonwebtoken");
require("dotenv").config();

function sign(payload, isAccessToken) {
  return jwt.sign(
    payload,
    isAccessToken
      ? process.env.ACCESS_TOKEN_SECRET
      : process.env.REFRESH_TOKEN_SECRET,
    {
      // Dura 1h el token
      expiresIn: isAccessToken ? 3600 : "30d",
      algorithm: "HS256",
    }
  );
}

// Función para generar un token de acceso utilizando jsonwebtoken
function generateAccessToken(user) {
  return sign({ user }, true);
}

// Función para generar un token de actualizacion utilizando jsonwebtoken
function generateRefreshToken(user) {
  return sign({ user }, false);
}

module.exports = { generateAccessToken, generateRefreshToken };
