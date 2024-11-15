const mongoose = require("mongoose");

const PacienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  edad: { type: Number, required: true },
  dni: { type: String, required: true, unique: true }, 
  diagnostico: { type: String, required: true}, 
});


PacienteSchema.statics.dniExists = async function (dni) {
  const result = await this.findOne({ dni });
  return result !== null;
};

module.exports = mongoose.model("Paciente", PacienteSchema, "pacientes");
