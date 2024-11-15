const mongoose = require("mongoose");

const historialSchema = new mongoose.Schema({
    // pacienteId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'Paciente'
    // },
    dni: {
        type: String,
        required: true,
        ref: 'Paciente'

    },
    juego: {
        type: String,
        required: true,
    },
    resultado: {
        type: String,
        required: true,
    },
    tiempo: {
        type: String,
        default: '',
    },

    comentario: {
        type: String,
        default: '',  // Comentario opcional
    },
    fecha: {
        type: Date,
        default: Date.now,  // Fecha actual por defecto
    }
});

const Historial = mongoose.model('Historial', historialSchema, 'historial');
module.exports = Historial;
