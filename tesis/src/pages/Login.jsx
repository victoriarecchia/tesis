import React, { useState } from "react";
import {  Button, FormControl, InputAdornment, InputLabel, OutlinedInput, Typography, Link } from "@mui/material";
import { AccountCircle, Lock } from '@mui/icons-material';
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../auth/authConstants";
import "../styles/Login.css";  

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");

    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const json = await response.json();
                if (json.body.accessToken && json.body.refreshToken) {
                    auth.saveUser(json);
                    navigate("/categorias");
                }
            } else {
                const json = await response.json();
                setErrorResponse(json.body.error || "Error desconocido al iniciar sesión.");
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: json.body.error || "Hubo un problema al iniciar sesión.",
                });
            }
        } catch (error) {
            console.error("Error en la solicitud de inicio de sesión:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Hubo un problema al intentar iniciar sesión. Por favor, inténtalo de nuevo.",
            });
        }
    };

    if (auth.user) {
        return <Navigate to="/categorias" />;
    }

    return (
        <div className="login-container">
            <Typography variant="h4" className="login-title">
                Login
            </Typography>
            <form className="login-form" onSubmit={handleSubmit}>
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel htmlFor="username">Nombre de usuario</InputLabel>
                    <OutlinedInput
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        }
                        label="Nombre de usuario"
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel htmlFor="password">Contraseña</InputLabel>
                    <OutlinedInput
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        startAdornment={
                            <InputAdornment position="start">
                                <Lock />
                            </InputAdornment>
                        }
                        label="Contraseña"
                    />
                </FormControl>
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    type="submit"
                    className="login-button"
                >
                    Iniciar sesión
                </Button>
                <Typography variant="body2" align="center" className="login-link">
                    ¿No tienes cuenta?{" "}
                    <Link href="/signup" underline="hover">
                        Crear Cuenta
                    </Link>
                </Typography>
            </form>
        </div>
    );
};

export default Login;