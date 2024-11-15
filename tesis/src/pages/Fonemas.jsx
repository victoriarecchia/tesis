import React, { useState, useEffect } from "react";
import '../styles/Fonemas.css'
import { API_URL } from "../../auth/authConstants";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const fonemas = ["LA", "MA", "TA", "RA", "SA", "ZA"];

const JuegoFonemas = () => {

    const [pacientes, setPacientes] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
    const [comentario, setComentario] = useState("");
    const [resultado, setResultado] = useState("");
    const [fonemaActual, setFonemaActual] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [resultadosFonemas, setResultadosFonemas] = useState([]);

    const obtenerPacientes = async () => {
        try {
            const response = await fetch(`${API_URL}/pacientes`);
            if (!response.ok) {
                throw new Error("No se pudo obtener los pacientes");
            }
            const data = await response.json();
            setPacientes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerPacientes();
    }, []);
    const reproducirFonema = (texto) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = "es-ES"; // Idioma español
        utterance.rate = 0.5; 
        synth.speak(utterance);
    };

    const siguienteFonema = () => {
        if (resultado) {
            setResultadosFonemas((prev) => [
                ...prev,
                { fonema: fonemas[fonemaActual], resultado }
            ]);
        }
        setResultado("");
        setFonemaActual((prev) => prev + 1);
    };

    // Función para guardar el historial
    const guardarHistorial = async () => {
        if (!pacienteSeleccionado) {
            alert("Por favor, selecciona un paciente.");
            return;
        }

        if (fonemaActual < fonemas.length) {
            alert("Por favor, completa todos los fonemas antes de guardar.");
            return;
        }

        const paciente = pacientes.find((p) => p._id === pacienteSeleccionado);
        const historialData = {
            pacienteId: paciente._id,
            dni: paciente.dni,
            juego: "Fonemas",
            resultado: resultadosFonemas.map(r => `Pronunciación de ${r.fonema}: ${r.resultado}`).join(', '),
            comentario: comentario || "Sin comentario",
            fecha: new Date(),
        };

        try {
            const response = await fetch(`${API_URL}/historial`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(historialData),
            });

            if (!response.ok) {
                throw new Error("Error al guardar historial.");
            }

            const data = await response.json();
            alert("Historial guardado correctamente.");
            setComentario("");
            setResultadosFonemas([]);
            setFonemaActual(0);
        } catch (err) {
            console.error("Error al guardar el historial:", err);
            alert("Hubo un error al guardar el historial.");
        }
    };

    if (loading) return <p>Cargando pacientes...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Juego de Pronunciación de Fonemas</h1>

            <FormControl sx={{ m: 1, minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Paciente</InputLabel>
                <Select value={pacienteSeleccionado}
                    onChange={(e) => setPacienteSeleccionado(e.target.value)}
                    label="Paciente">
                    {pacientes.map((paciente) => (
                        <MenuItem value={paciente._id}>
                            {paciente.nombre} {paciente.apellido} - DNI: {paciente.dni}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <h2>Fonema actual:{fonemas[fonemaActual]}</h2>

            <button className="editar-btn" onClick={() => reproducirFonema(fonemas[fonemaActual])}>Escuchar Fonema</button>

            <Box>
                <h3>Selecciona el puntaje de la pronunciación (1 - 5):</h3>
                <div>
                    {[1, 2, 3, 4, 5].map((puntaje) => (
                        <button
                            key={puntaje}
                            onClick={() => setResultado(puntaje)}
                            className={`puntaje-btn ${resultado === puntaje ? "seleccionado" : ""}`}
                        >
                            {puntaje}
                        </button>
                    ))}
                </div>
            </Box>

            <div className="comentarioFonemas">
                <label >Comentario del fonoaudiólogo:</label>
                <textarea
                    id="comentario"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Escribe un comentario o detalle sobre la pronunciación."
                    rows="5"
                    style={{ width: "60%" }}
                />
            </div>

            <button onClick={siguienteFonema}>Siguiente Fonema</button>

            {fonemaActual === fonemas.length && (
                <button onClick={guardarHistorial}>Guardar Historial</button>
            )}
        </div>
    );
};

export default JuegoFonemas;
