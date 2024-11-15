function validateToken(header) {
  if (!header || !header["authorization"]) {
    throw new Error("Token not provided");
  }

  const authHeader = header["authorization"];
  const tokenParts = authHeader.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    throw new Error("Token format invalid");
  }

  return tokenParts[1];
}

module.exports = validateToken;
