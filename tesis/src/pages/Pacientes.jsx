import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Pacientes.css';
import '../styles/Historial.css';  
import { API_URL } from "../../auth/authConstants";
import { Button } from "@mui/material";

const Pacientes = () => {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPacientes = async () => {
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

        fetchPacientes();
    }, []);

    if (loading) return <p>Cargando pacientes...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1 className="titulo">Lista de pacientes</h1>
            <div className="paciente-container">
                {pacientes.map((paciente) => (
                    <div className="paciente-info" key={paciente._id}>
                        <h2>{paciente.nombre} {paciente.apellido}</h2>
                        <h3>DNI: {paciente.dni}</h3>
                        <h3>Edad: {paciente.edad}</h3>
                        <h3>Fecha inicio tratamiento: {paciente.fechaInicio ? new Date(paciente.fechaInicio).toLocaleDateString('es-ES') : "No disponible"}</h3>
                        <h3>Diagnóstico: {paciente.diagnostico || "No disponible"}</h3>
                        
                        <Link to={`/editarpaciente/${paciente._id}`}>
                            <button className="editar-btn">Editar paciente</button>
                        </Link>
                        <Link to={`/historial/${paciente.dni}`}>
                            <button className="historial-btn">Ver historial</button>
                        </Link>
                    </div>
                ))}
            </div>
            <Link to="/signpaciente" className="link-boton">
            <Button variant="contained" color="success" size="large">Registrar nuevo paciente</Button>
            </Link>
        </div>
    );
};

export default Pacientes;
