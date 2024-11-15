const express = require('express');
const router = express.Router();
const Paciente = require('../schema/pacienteSchema'); 

// Ruta para registrar un paciente
router.post('/', async (req, res) => {
  const { nombre, apellido, dni, edad, diagnostico, fechaInicio } = req.body;

  // Validar los campos
  if (!nombre || !apellido || !dni || !edad || !diagnostico || !fechaInicio) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si el paciente con el mismo DNI ya existe
    const pacienteExistente = await Paciente.findOne({ dni });
    if (pacienteExistente) {
      return res.status(409).json({ error: 'Paciente con el mismo DNI ya existe' });
    }

    // Crear el nuevo paciente
    const nuevoPaciente = new Paciente({ nombre, apellido, dni, diagnostico, edad, fechaInicio});
    await nuevoPaciente.save();

    // Respuesta exitosa
    res.status(201).json({ mensaje: 'Paciente registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al registrar el paciente' });
  }
});

module.exports = router;
