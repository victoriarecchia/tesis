const express = require('express');
const router = express.Router();
const Paciente = require('../schema/pacienteSchema');


router.get("/", async (req, res) => {
  const { dni } = req.query; 
  if (dni) {
    try {
      const paciente = await Paciente.findOne({ dni });
      if (!paciente) {
        return res.status(404).json({ error: "Paciente no encontrado" });
      }

      res.status(200).json(paciente);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener el paciente" });
    }
  } else {

    try {
      const pacientes = await Paciente.find(); 
      res.status(200).json(pacientes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al obtener los pacientes" });
    }
  }
});
// Eliminar un paciente por su ID
router.delete("/:id", async (req, res) => {
  const pacienteId = req.params.id; 

  try {
      const paciente = await Paciente.findByIdAndDelete(pacienteId);
      if (!paciente) {
          return res.status(404).json({ error: "Paciente no encontrado" });
      }

      res.status(200).json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
      console.error("Error al eliminar el perfil:", error);
      res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Ruta para obtener un paciente por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params; 
  try {
    const paciente = await Paciente.findById(id);

    if (!paciente) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    res.status(200).json(paciente); 
  } catch (error) {
    console.error("Error al obtener el paciente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get('/', async (req, res) => {
  const { dni } = req.query;  // Obtén el DNI desde la query de la URL
  try {
    const paciente = await Paciente.findOne({ dni });  // Buscar el paciente en la base de datos
    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el paciente", error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, dni, edad, fechaInicio, diagnostico } = req.body;

  try {
    const pacienteConDni = await Paciente.findOne({ dni });
    if (pacienteConDni && pacienteConDni._id.toString() !== id) {
      return res.status(400).json({ error: "El DNI ya está registrado en otro paciente" });
    }
    const paciente = await Paciente.findByIdAndUpdate(
      id,
      { nombre, apellido, dni, edad, fechaInicio, diagnostico },
      { new: true } 
    );

    if (!paciente) {
      return res.status(404).json({ error: "Paciente no encontrado" });
    }

    res.status(200).json({ message: "Perfil actualizado correctamente", paciente });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.get('/verificar-dni/:dni', async (req, res) => {
  const { dni } = req.params;
  try {
      const paciente = await Paciente.findOne({ dni });
      if (paciente) {
          return res.json({ existe: true });
      }
      return res.json({ existe: false });
  } catch (error) {
      console.error("Error al verificar el DNI:", error);
      return res.status(500).json({ message: "Error interno del servidor" });
  }
});




module.exports = router;
