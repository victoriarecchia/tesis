const express = require("express");
const router = express.Router();
const authenticateToken = require("../auth/authenticateToken");
const Paciente = require("../schema/pacienteSchema");



// Metodo para actualizar un paciente por su ID 
router.put("/:id", authenticateToken, async (req, res) => {
    const pacienteId = req.params.id;  // Obtener el ID desde la URL
    const { nombre, apellido, dni, edad, diagnostico, fechaInicio } = req.body;

    try {
        const paciente = await Paciente.findByIdAndUpdate(
            pacienteId,
            { nombre, apellido, dni, edad, diagnostico, fechaInicio },
            { new: true } 
        );

        if (!paciente) {
            return res.status(404).json({ error: "Paciente no encontrado" });
        }

        res.status(200).json({ message: "Paciente actualizado correctamente", paciente });
    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

module.exports = router;
