import React, { useState, useEffect } from 'react';
import { FormControl, TextField, Button, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import '../styles/Historial.css';
import { API_URL } from '../../auth/authConstants';

const HistorialPaciente = () => {
  const { dni } = useParams();
  const [dniBusqueda, setDniBusqueda] = useState(dni || '');
  const [paciente, setPaciente] = useState(null);
  const [historial, setHistorial] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verMasJuego, setVerMasJuego] = useState({});

  // Función para buscar al paciente por DNI y su historial
  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setPaciente(null);
    setHistorial({});

    try {
      const response = await fetch(`${API_URL}/pacientes?dni=${query}`);
      if (!response.ok) {
        throw new Error("Paciente no encontrado");
      }
      const data = await response.json();

      if (data) {
        setPaciente(data);
        const historialResponse = await fetch(`${API_URL}/historial/${data.dni}`);
        if (!historialResponse.ok) {
          throw new Error("Error al obtener historial");
        }
        const historialData = await historialResponse.json();

        if (historialData.message) {
          setError(historialData.message);
        } else {
          const historialAgrupado = {};
          for (const juego in historialData) {
            const partidas = historialData[juego]
              .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
              .slice(0, 5);

            historialAgrupado[juego] = partidas;
          }
          setHistorial(historialAgrupado);
        }
      } else {
        setError("Paciente no encontrado");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (dni) {
      handleSearch(dni);
    }
  }, [dni]);

  const toggleVerMasJuego = (juego) => {
    setVerMasJuego((prev) => ({
      ...prev,
      [juego]: !prev[juego],
    }));
  };

  const handleDniBusquedaChange = (e) => {
    setDniBusqueda(e.target.value);
  };

  const handleDniBusquedaSubmit = (e) => {
    e.preventDefault();
    if (dniBusqueda) {
      handleSearch(dniBusqueda);
    }
  };

  return (
    <div className='historialContainer'>
      <h1 className='titulo'>Historial de Pacientes</h1>
      <FormControl onSubmit={handleDniBusquedaSubmit} component="form" className="busquedaHistorial">
        <Box display="flex" alignItems="center">
          <FormControl fullWidth variant="outlined">
            <TextField
              id="dni-input"
              value={dniBusqueda}
              onChange={handleDniBusquedaChange}
              placeholder="Buscar por DNI"
            />
          </FormControl>
          <Button
            color="success"
            variant="contained"
            type="submit"
            sx={{ m: "20px" }}
          >
            Buscar
          </Button>
        </Box>
      </FormControl>

      {loading && <p className="loading">Buscando paciente...</p>}
      {error && <p className="error">{error}</p>}
      {paciente ? (
        <div className="informe-paciente">
          <h2 style={{textAlign: "center"}}>{paciente.nombre} {paciente.apellido}</h2>
          <p>DNI: {paciente.dni}</p>
          <p> Diagnóstico: {paciente.diagnostico || "No disponible"}</p>

          {Object.keys(historial).length > 0 ? (
            <div className="informe-historial">
              <h4>HISTORIAL DE JUEGOS</h4>
              {Object.keys(historial).map((juego) => (
                <div key={juego} className="informe-juego">
                  <h5>{juego}</h5>
                  <ul>
                    {(verMasJuego[juego] ? historial[juego] : historial[juego].slice(0, 2)).map((partida, index) => (
                      <li key={index} className="informe-partida">
                        <p><strong>Resultado:</strong> {partida.resultado}</p>
                        <p><strong>Comentario:</strong> {partida.comentario}</p>
                        <p><strong>Fecha:</strong> {new Date(partida.fecha).toLocaleString()}</p>
                      </li>
                    ))}
                  </ul>
                  {historial[juego].length > 2 && (
                    <button onClick={() => toggleVerMasJuego(juego)}>
                      {verMasJuego[juego] ? "Ver menos" : "Ver más"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>No hay historial disponible para este paciente.</p>
          )}
        </div>
      ) : (
        !loading && !error && <p>No se encontró el paciente</p>
      )}
    </div>
  );
};

export default HistorialPaciente;
