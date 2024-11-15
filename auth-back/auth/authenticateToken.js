const log = require("../lib/trace");
const validateToken = require("./validateToken");
const { verifyAccessToken } = require("./verify");

function authenticateToken(req, res, next) {
  let token = null;
  log.info("headers", req.headers);

  try {
    token = validateToken(req.headers);
    log.info("Token", token);
  } catch (error) {
    log.error(error.message);

    if (error.message === "Token not provided") {
      return res.status(401).json({ error: "Token no proporcionado" });
    }
    if (error.message === "Token format invalid") {
      return res.status(401).json({ error: "Token mal formado" });
    }
  }

  try {
    const decoded = verifyAccessToken(token); 
    req.user = { ...decoded.user };
    next(); 
  } catch (err) {
    log.error("Token inválido", err);
    return res.status(403).json({ error: "Token inválido" });
  }
}

module.exports = authenticateToken;
