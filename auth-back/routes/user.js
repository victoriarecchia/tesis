const express = require("express");
const { jsonResponse } = require("../lib/jsonResponse");
const log = require("../lib/trace");
const router = express.Router();
const User = require("../schema/userShema.js")


router.get("/", async function (req, res, next) {
  log.info("user", req.user);
  res.json(jsonResponse(200, req.user));
});


 // Busca todos los usuarios en la base de datos
router.get("/users", async function (req, res, next) {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      res.status(500).json({ message: "Error al obtener los usuarios" });
    }
});

router.delete("/", async function (req, res, next) {
  try {
    const refreshToken = validateToken(req.headers);

    await Token.findOneAndRemove({ token: refreshToken });
    res.json({
      success: "Token removed",
    });
  } catch (ex) {
    return next(new Error("Error loging out the user " + ex.message));
  }
});

// router.delete('/:_id', async (req, res) => {
//   const userId = req.params._id;

//   try {
//     const deletedUser = await User.findByIdAndDelete(userId);

//     if (!deletedUser) {
//       return res.status(404).json({ error: 'Usuario no encontrado' });
//     }

//     res.json({ message: 'Usuario eliminado correctamente' });
//   } catch (error) {
//     console.error('Error al eliminar usuario:', error);
//     res.status(500).json({ error: 'Error interno al eliminar usuario' });
//   }
// });


module.exports = router;




