import React, { useState, useEffect } from 'react';
import { FormControl, Button, Box, TextField } from '@mui/material'; 
import { useNavigate } from 'react-router-dom'; 
import '../styles/Historial.css';
import { API_URL } from '../../auth/authConstants';

const Historial = () => {
  const [dniBusqueda, setDniBusqueda] = useState(''); 
  const [paciente, setPaciente] = useState(null);
  const [historial, setHistorial] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [verMasJuego, setVerMasJuego] = useState({});
  const navigate = useNavigate(); 

  const handleSearch = async (query) => {
    setLoading(true);
    setError(null);
    setPaciente(null);
    setHistorial({});

    // Peticion GET para buscar al paciente por DNI
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dniBusqueda) {
      navigate(`/historial/pacientes/${dniBusqueda}`);
    }
  };

  useEffect(() => {
    if (dniBusqueda) {
      handleSearch(dniBusqueda);
    }
  }, [dniBusqueda]);

  const toggleVerMasJuego = (juego) => {
    setVerMasJuego((prev) => ({
      ...prev,
      [juego]: !prev[juego],
    }));
  };

  return (
    <div className='historialContainer'>
      <h1 className='titulo'>Historial de Pacientes</h1>

      <FormControl onSubmit={handleSubmit} component="form" className="busquedaHistorial">
        <Box display="flex" alignItems="center">
          <FormControl fullWidth variant="outlined">
            <TextField
              id="dni-input"
              value={dniBusqueda}
              onChange={(e) => setDniBusqueda(e.target.value)}
              placeholder="Buscar por DNI"
            />
          </FormControl>
            <Button
              color="success"
              variant="contained"
              type="submit"
              sx={{m: "10px"}}>
              Buscar
            </Button>
        </Box>
      </FormControl>

      {loading && <p className="loading">Buscando paciente...</p>}
      {error && <p className="error">{error}</p>}
      {paciente ? (
        <div className="informe-paciente">
          <h2 style={{textAlign: "center"}}>{paciente.nombre} {paciente.apellido}</h2>
          <h3>Diagnóstico: {paciente.diagnostico || "No disponible"}</h3>

          {Object.keys(historial).length > 0 ? (
            <div className="informe-historial">
              <h4>Historial de Juegos</h4>
              {Object.keys(historial).map((juego) => (
                <div key={juego} className="informe-juego">
                  <h5>{juego}</h5>
                  <ul>
                    {(verMasJuego[juego] ? historial[juego] : historial[juego].slice(0, 2)).map((partida, index) => (
                      <li key={index} className="juego">
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

export default Historial;
