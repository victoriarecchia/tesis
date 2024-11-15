import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import '../styles/EditarPaciente.css'
import { API_URL } from "../../auth/authConstants";
import { Button, FormControl, InputLabel, OutlinedInput, Box } from "@mui/material";

const EditarPaciente = () => {
    const { id } = useParams(); 
    const [paciente, setPaciente] = useState({});
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [edad, setEdad] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [dni, setDni] = useState("");
    const [diagnostico, setDiagnostico] = useState("");
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPaciente = async () => {
            setLoading(true);
            const response = await fetch(`${API_URL}/pacientes/${id}`);
            if (!response.ok) {
                console.error("Error al obtener los datos del paciente");
                setLoading(false);
                return;
            }
            const data = await response.json();
            setPaciente(data);
            setNombre(data.nombre);
            setApellido(data.apellido);
            setDni(data.dni);
            setEdad(data.edad);
            setFechaInicio(data.fechaInicio);
            setDiagnostico(data.diagnostico || "");
            setLoading(false);
        };
        fetchPaciente();
    }, [id]);

    const checkDniRepetido = async () => {
        try {
            const response = await fetch(`${API_URL}/pacientes/verificar-dni/${dni}`);
            if (!response.ok) {
                console.error("Error al verificar el DNI");
                return false;
            }
            const data = await response.json();
            return data.existe;
        } catch (error) {
            console.error("Error al hacer la solicitud de verificación:", error);
            return false;
        }
    };

    const deleteAccount = async () => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "Esta acción eliminará al paciente permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${API_URL}/pacientes/${id}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                });
                if (response.ok) {
                    Swal.fire({
                        icon: "success",
                        title: "Paciente eliminado",
                        text: "El paciente ha sido eliminado correctamente.",
                    });
                    navigate("/pacientes");
                } else {
                    const errorData = await response.json();
                    Swal.fire({
                        icon: "error",
                        title: "¡Error!",
                        text: errorData.error || "Error al eliminar el paciente.",
                    });
                }
            } catch (error) {
                console.error("Error al eliminar el paciente:", error);
                Swal.fire({
                    icon: "error",
                    title: "¡Error!",
                    text: "No se pudo conectar con el servidor.",
                });
            }
        }
    };

    const handleUpdate = async () => {
        if (!nombre || !apellido || !dni || !edad || !fechaInicio || !diagnostico) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "Por favor, complete todos los campos antes de guardar.",
            });
            return;
        }

        let dniRepetido = false;
        if (dni !== paciente.dni) {
            dniRepetido = await checkDniRepetido();
            if (dniRepetido) {
                Swal.fire({
                    icon: "error",
                    title: "¡Error!",
                    text: "El DNI ingresado ya está registrado. Por favor, ingresa uno diferente.",
                });
                return;
            }
        }

        const fechaFormateada = new Date(fechaInicio).toISOString().split("T")[0];

        const pacienteData = { nombre, apellido, dni, diagnostico, edad, fechaInicio: fechaFormateada };

        setLoading(true); 
        try {
            const response = await fetch(`${API_URL}/pacientes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pacienteData),
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Paciente actualizado",
                    text: "Los datos del paciente se han actualizado correctamente.",
                });
                navigate("/pacientes");
            } else {
                const errorData = await response.json();
                Swal.fire({
                    icon: "error",
                    title: "¡Error!",
                    text: errorData.error || "Error al actualizar el paciente",
                });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: "No se pudo conectar con el servidor.",
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Cargando datos del paciente...</p>;

    return (
        <div>
            <h1 className="titulo">Editar Paciente</h1>
        <Box
            sx={{
                maxWidth: 400, 
                margin: "2rem auto", 
                padding: "2rem",
                boxShadow: 3, 
                gap: "1rem",
                borderRadius: "8px", 
                backgroundColor: "#fff", 
            }}
        >
                <FormControl fullWidth variant="outlined" sx={{mb:2}}>
                    <InputLabel htmlFor="nombre">Nombre</InputLabel>
                    <OutlinedInput
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{mb:2}}>
                    <InputLabel htmlFor="apellido">Apellido</InputLabel>
                    <OutlinedInput
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{mb:2}}>
                    <InputLabel htmlFor="dni">DNI</InputLabel>
                    <OutlinedInput
                        type="number"
                        id="dni"
                        name="dni"
                        value={dni}
                        onChange={(e) => setDni(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{mb:2}}>
                    <InputLabel htmlFor="edad">Edad</InputLabel>
                    <OutlinedInput
                        type="number"
                        id="edad"
                        name="edad"
                        value={edad}
                        onChange={(e) => setEdad(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{mb:2}}>
                    <InputLabel htmlFor="fechaInicio">Fecha de inicio</InputLabel>
                    <OutlinedInput
                        type="date"
                        id="fechaInicio"
                        name="fechaInicio"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined" sx={{mb:2}}>
                    <InputLabel htmlFor="diagnostico">Diagnóstico</InputLabel>
                    <OutlinedInput
                        type="text"
                        id="diagnostico"
                        name="diagnostico"
                        value={diagnostico}
                        onChange={(e) => setDiagnostico(e.target.value)}
                    />
                </FormControl>
                <Button onClick={handleUpdate} disabled={loading} color="success" variant="contained" sx={{mb:2}}>
                    {loading ? "Guardando..." : "Guardar cambios"}
                </Button>
                <Button onClick={deleteAccount} disabled={loading} color="error" variant="contained" sx={{mb:2}}>
                    {loading ? "Eliminando..." : "Eliminar paciente"}
                </Button>
            </Box>
        </div>
    );
};

export default EditarPaciente;
