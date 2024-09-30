
import React, { useState } from 'react';
import './Articulacion.css';

const Articulacion = () => {
    const [puntuacion, setPuntuacion] = useState(0);
    const [preguntaActual, setPreguntaActual] = useState(0);
    const preguntas = [
        {
            pregunta: "¿Cuál es ?",
            opciones: ["París", "Londres", "Berlín", "Madrid"],
            respuesta: "París"
        },
        {
            pregunta: "¿Cuánto es 2 + 2?",
            opciones: ["3", "4", "5", "6"],
            respuesta: "4"
        }
        // Agrega más preguntas según sea necesario
    ];

    const manejarRespuesta = (opcion) => {
        if (opcion === preguntas[preguntaActual].respuesta) {
            setPuntuacion(puntuacion + 1);
        }
        setPreguntaActual(preguntaActual + 1);
    };

    return (
        <div className="articulacion-container">
            {preguntaActual < preguntas.length ? (
                <div className="pregunta-container">
                    <h2>{preguntas[preguntaActual].pregunta}</h2>
                    {preguntas[preguntaActual].opciones.map((opcion, indice) => (
                        <button key={indice} onClick={() => manejarRespuesta(opcion)} className="opcion-boton">
                            {opcion}
                        </button>
                    ))}
                </div>
            ) : (
                <div className="resultado-container">
                    <h2>Juego Terminado</h2>
                    <p>Tu puntuación es: {puntuacion}</p>
                </div>
            )}
        </div>
    );
};

export default Articulacion;