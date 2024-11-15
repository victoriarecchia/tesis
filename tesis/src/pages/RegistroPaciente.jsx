import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { API_URL } from "../../auth/authConstants";
import { Button, FormControl, InputLabel, OutlinedInput, Box, Typography, Alert } from "@mui/material";
import { Label } from "@mui/icons-material";

const RegistroPaciente = () => {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [dni, setDni] = useState("");
    const [edad, setEdad] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [errorResponse, setErrorResponse] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        // Peticion POST para registrar un paciente
        try {
            const response = await fetch(`${API_URL}/signpaciente`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, apellido, dni, edad, diagnostico, fechaInicio }),
            });

            if (response.ok) {
                setNombre("");
                setApellido("");
                setDni("");
                setEdad("");
                setDiagnostico("");
                setFechaInicio("");
                setErrorResponse("");
                setLoading(false);

                Swal.fire({
                    icon: "success",
                    title: "Paciente registrado con éxito",
                    text: "La cuenta ha sido creada exitosamente.",
                });

                navigate("/pacientes");
            } else {
                const json = await response.json();
                if (response.status === 409 && json.body.error === "El DNI ya se encuentra registrado") {
                    setErrorResponse("El paciente ya está registrado. Por favor, revise nuevamente.");
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "El paciente ya está registrado. Por favor, revise nuevamente.",
                    });
                } else {
                    setErrorResponse(json.body.error || "Ocurrió un error inesperado.");
                }
                setLoading(false);
            }
        } catch (error) {
            console.error("Error en la solicitud de registro:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al intentar registrarte. Por favor, inténtalo de nuevo.",
            });
            setLoading(false);
        }
    }

    return (
        <Box sx={{
                maxWidth: 400, 
                margin: "2rem auto", 
                paddingBottom: "5rem",
            }}>
            <h1 className="titulo">
                Registrar paciente
            </h1>

            <form onSubmit={handleSubmit}>
                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel htmlFor="nombre">Nombre</InputLabel>
                    <OutlinedInput
                        id="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        label="Nombre"
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel htmlFor="apellido">Apellido</InputLabel>
                    <OutlinedInput
                        id="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        label="Apellido"
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel htmlFor="dni">DNI</InputLabel>
                    <OutlinedInput
                        id="dni"
                        type="number"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                        label="DNI"
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel htmlFor="edad">Edad</InputLabel>
                    <OutlinedInput
                        id="edad"
                        type="number"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                        label="Edad"
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" variant="outlined">
                    <Label>Fecha de inicio</Label>
                    <OutlinedInput
                        id="fechaInicio"
                        type="date"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                        label="Fecha de inicio"
                    />
                </FormControl>

                <FormControl fullWidth margin="normal" variant="outlined">
                    <InputLabel htmlFor="diagnostico">Diagnóstico</InputLabel>
                    <OutlinedInput
                        id="diagnostico"
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                        label="Diagnóstico"
                    />
                </FormControl>

                {errorResponse && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {errorResponse}
                    </Alert>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    disabled={loading}
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    {loading ? "Registrando paciente..." : "Registrar"}
                </Button>

                <Link to="/pacientes" style={{ textDecoration: "none" }}>
                    <Button variant="outlined" color="info" fullWidth sx={{ mt: 2 }}>
                        Ver todos los pacientes
                    </Button>
                </Link>
            </form>
        </Box>
    );
};

export default RegistroPaciente;
