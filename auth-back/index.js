  const express = require("express");
  const cors = require("cors");
  const app = express();
  const mongoose = require("mongoose");
  const authenticateToken = require("./auth/authenticateToken");
  const log = require("./lib/trace");
  require("dotenv").config();

  app.use(express.json());
  app.use(cors());

const port = process.env.PORT || 8080;

  main().catch((err) => console.log(err));

  async function main() {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);

    console.log("Conectado a la base de datos");
  }

  app.use("/api/signup", require("./routes/signup"));
  app.use("/api/login", require("./routes/login"));
  app.use("/api/signout", require("./routes/signout"));

  //Ruta para registrar un paciente
  app.use('/api/signpaciente', require('./routes/signpaciente'));
    
  // Ruta para renovar el token de acceso utilizando el token de actualización
  app.use("/api/refresh-token", require("./routes/refreshToken"));

  // Ruta para obtener la información del usuario
  app.use("/api/users", authenticateToken, require("./routes/user"));

  //Ruta para obtener los pacientes
  app.use('/api/pacientes', require('./routes/pacientes')); 

  //Ruta para obtener editar perfil paciente
  app.use('/api/editarpaciente', require('./routes/editarpaciente'));

  //Ruta para obtener historial paciente
  app.use('/api/historial', require('./routes/historial')); 


  app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
  });

  module.exports = app;
