import React, { useState, useEffect } from "react";
import '../styles/Memoria.css';
import { API_URL } from "../../auth/authConstants";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import Swal from 'sweetalert2'; // Importar SweetAlert2

const simbolos = ["🐶", "🦁", "🐱", "🐬", "🐎", "🐁", "🐳", "🦋"];

const Memoria = () => {
  const [cartas, setCartas] = useState([]);
  const [cartasVolteadas, setCartasVolteadas] = useState([]);
  const [cartasIguales, setCartasIguales] = useState([]);
  const [movimientos, setMovimientos] = useState(0);
  const [ganado, setGanado] = useState(false);

  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState("");
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [tiempo, setTiempo] = useState(0); // Para controlar el tiempo
  const [cronometroActivo, setCronometroActivo] = useState(false); // Para saber si el cronómetro está activo
  const [cronometroIniciado, setCronometroIniciado] = useState(false); // Para controlar el inicio del cronómetro

  useEffect(() => {
    obtenerPaciente();
    iniciarJuego();
  }, []);

  const obtenerPaciente = async () => {
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

  const iniciarJuego = () => {
    const cartasMezcladas = [...simbolos, ...simbolos]
      .sort(() => Math.random() - 0.5)
      .map((simbolo, indice) => ({ id: indice, simbolo, volteada: false }));
    setCartas(cartasMezcladas);
    setCartasVolteadas([]);
    setCartasIguales([]);
    setMovimientos(0);
    setGanado(false);
    setTiempo(0);
    setCronometroActivo(false); // No activar cronómetro al iniciar
    setCronometroIniciado(false); // No iniciar cronómetro
  };

  // Iniciar cronómetro al comenzar el juego
  useEffect(() => {
    let intervalo;
    if (cronometroActivo) {
      intervalo = setInterval(() => {
        setTiempo((prev) => prev + 1); // Incrementa el tiempo cada segundo
      }, 1000);
    }
    return () => clearInterval(intervalo); // Limpiar intervalo al detener el cronómetro
  }, [cronometroActivo]);

  const manejarClickCarta = (indice) => {
    if (cartasVolteadas.length === 2 || cartasVolteadas.includes(indice) || cartasIguales.includes(indice)) return;

    // Iniciar cronómetro cuando se mueva la primera carta
    if (!cronometroIniciado) {
      setCronometroIniciado(true);
      setCronometroActivo(true);
    }

    const nuevasCartasVolteadas = [...cartasVolteadas, indice];
    setCartasVolteadas(nuevasCartasVolteadas);

    if (nuevasCartasVolteadas.length === 2) {
      setMovimientos(movimientos + 1);
      const [primerIndice, segundoIndice] = nuevasCartasVolteadas;
      if (cartas[primerIndice].simbolo === cartas[segundoIndice].simbolo) {
        setCartasIguales([...cartasIguales, primerIndice, segundoIndice]);
        setCartasVolteadas([]);
      } else {
        setTimeout(() => setCartasVolteadas([]), 1000);
      }
    }
  };

  useEffect(() => {
    if (cartasIguales.length === simbolos.length * 2) {
      setGanado(true);
      setCronometroActivo(false); 
    }
  }, [cartasIguales]);

  const reiniciarJuego = () => {
    iniciarJuego();
  };

  const guardarHistorial = async () => {
    if (!pacienteSeleccionado) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, selecciona un paciente.',
        timer: 3000, 
      });
      return;
    }

    const paciente = pacientes.find((p) => p._id === pacienteSeleccionado);
    const historialData = {
      pacienteId: paciente._id,
      dni: paciente.dni,
      juego: "Memoria",
      resultado: `Ganado en ${movimientos} movimientos`,
      tiempo: `${tiempo} segundos`, 
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
      Swal.fire({
        icon: 'success',
        title: 'Historial Guardado',
        text: 'El historial se ha guardado correctamente.',
        timer: 3000, 
      });
      setComentario("");
    } catch (err) {
      console.error("Error al guardar el historial:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al guardar el historial.',
        timer: 3000, 
      });
    }
  };

  if (loading) return <p>Cargando pacientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="juego-memoria">
      <FormControl sx={{ m: 1, minWidth: 300 }}>
        <InputLabel id="demo-simple-select-label">Paciente</InputLabel>
        <Select
          value={pacienteSeleccionado}
          onChange={(e) => setPacienteSeleccionado(e.target.value)}
          label="Paciente"
        >
          {pacientes.map((paciente) => (
            <MenuItem key={paciente._id} value={paciente._id}>
              {paciente.nombre} {paciente.apellido} - DNI: {paciente.dni}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <h1>Juego de Memoria</h1>
      <p>Movimientos: {movimientos}</p>
      <p>Tiempo: {tiempo} segundos</p>

      <div className="contenedor-juego">
        {cartas.map((carta, indice) => (
          <div
            key={indice}
            className={`carta-memoria ${cartasVolteadas.includes(indice) || cartasIguales.includes(indice) ? "volteada" : ""}`}
            onClick={() => manejarClickCarta(indice)}
          >
            {(cartasVolteadas.includes(indice) || cartasIguales.includes(indice)) && carta.simbolo}
          </div>
        ))}
      </div>

      {ganado && (
        <div className="mensajeFinal">
          <p>Juego finalizado con: {movimientos} movimientos y {tiempo} segundos</p>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Agregar un comentario"
            className="comentario-input"
          />
          <button onClick={reiniciarJuego}>Reiniciar juego</button>
          <button onClick={guardarHistorial}>Guardar Historial</button>
        </div>
      )}
    </div>
  );
};

export default Memoria;
