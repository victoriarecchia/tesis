const express = require("express");
const Token = require("../schema/token"); // Asegúrate de que el esquema Token está bien configurado
const log = require("../lib/trace");
const { jsonResponse } = require("../lib/jsonResponse");

const router = express.Router();

router.delete("/", async (req, res) => {
    log.info("DELETE /api/signout");

    const refreshToken = req.headers.authorization?.split(" ")[1];

    if (!refreshToken) {
        return res
            .status(401)
            .json(jsonResponse(401, { error: "Token de actualización no proporcionado" }));
    }

    try {
        const deletedToken = await Token.findOneAndDelete({ token: refreshToken });

        if (!deletedToken) {
            return res
                .status(403)
                .json(jsonResponse(403, { error: "Token de actualización no válido" }));
        }

        res.json(jsonResponse(200, { message: "Cierre de sesión exitoso" }));
    } catch (error) {
        log.error("Error al intentar cerrar sesión:", error);
        res.status(500).json(jsonResponse(500, { error: "Error en el servidor al cerrar sesión" }));
    }
});

module.exports = router;
