import React, { useState } from "react"
import '../styles/Registro.css'
import { useNavigate, Navigate, Link } from "react-router-dom"
import Swal from "sweetalert2"
import { useAuth } from "../../auth/AuthProvider"
import { API_URL } from "../../auth/authConstants"
import { Button, FormControl, InputAdornment, InputLabel, OutlinedInput, Typography } from "@mui/material"
import { AccountCircle, Lock } from "@mui/icons-material"  // Importing Lock icon

const Registro = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [errorResponse, setErrorResponse] = useState("")
    const [loading, setLoading] = useState(false)

    const auth = useAuth()
    const navigate = useNavigate()

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password, email }),
            })

            if (response.ok) {
                setUsername("")
                setPassword("")
                setEmail("")
                setErrorResponse("")
                setLoading(false)
                navigate("/login")

                Swal.fire({
                    icon: "success",
                    title: "Registro Exitoso",
                    text: "Tu cuenta ha sido creada exitosamente.",
                })

                // navigate("/categorias")
            } else {
                const json = await response.json()
                if (response.status === 409 && json.body.error === "El nombre de usuario ya existe") {
                    setErrorResponse("El nombre de usuario ya está en uso. Por favor, elija otro.")

                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "El nombre de usuario ya está en uso. Por favor, elija otro.",
                    })
                } else {
                    setErrorResponse(json.body.error)
                }
                setLoading(false) // Dejar de cargar
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            setErrorResponse("Error de red al intentar crear usuario.")
            setLoading(false) // Dejar de cargar
        }
    }

    if (auth.isAuthenticated) {
        return <Navigate to="/login" />
    }

    return (
        <div className="login-container">
            <Typography variant="h4" className="login-title">
                Registro
            </Typography>
            <form className="login-form" onSubmit={handleSubmit}>
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel htmlFor="email">Correo Electrónico</InputLabel>
                    <OutlinedInput
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        }
                        label="Correo Electrónico"
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel htmlFor="username">Nombre de Usuario</InputLabel>
                    <OutlinedInput
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        startAdornment={
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        }
                        label="Nombre de Usuario"
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
                    disabled={loading}
                >
                    {loading ? "Registrando..." : "Registrarse"}
                </Button>
                <Typography variant="body2" align="center" className="login-link">
                    ¿Ya tienes cuenta?{" "}
                    <Link to="/login" underline="hover">
                        Iniciar sesión
                    </Link>
                </Typography>
                {errorResponse && <div className="error">{errorResponse}</div>}
            </form>
        </div>
    )
}

export default Registro
