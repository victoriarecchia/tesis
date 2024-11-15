import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "./logo.png";
import { useAuth } from "../../auth/AuthProvider";
import { API_URL } from "../../auth/authConstants";

const Navbar = ({ menu, setMenu }) => {
    const auth = useAuth();
    const [subMenuVisible, setSubMenuVisible] = useState(false);
    const navigate = useNavigate();

    async function handleSignOut(e) {
        e.preventDefault();

        const refreshToken = auth.getRefreshToken();
        console.log("Refresh Token:", refreshToken);

        if (!refreshToken) {
            console.error("No se encontró el token de actualización.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/signout`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${refreshToken}`,
                },
            });
console.log(response.status, await response.text())
            if (response.ok) {
                auth.signout(); 
                setMenu(false);  
                navigate("/login"); 
            } else {
                console.error("Error en la respuesta del servidor al cerrar sesión.");
            }
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }

    const toggleSubMenu = () => {
        setSubMenuVisible(!subMenuVisible);
    };

    return (
        <div className={menu ? "sidenav active" : "sidenav"}>
            <Link to="/">
                <img src={logo} alt="logo" className="logo" />
            </Link>
            <ul className="navbar-links">
                {!auth.isAuthenticated ? (
                    <>
                        <li>
                            <Link to="/login" onClick={() => setMenu(false)}>
                                Iniciar Sesión
                            </Link>
                        </li>
                        <li>
                            <Link to="/signup" onClick={() => setMenu(false)}>
                                Registrarse
                            </Link>
                        </li>
                    </>
                ) : (
                    <>
                        <li className="dropdown">
                            <button onClick={toggleSubMenu} className="dropdown-btn">
                                Categorías <span className="arrow">&#9660;</span>
                            </button>
                            {subMenuVisible && (
                                <ul className="sub-menu">
                                    <li>
                                        <Link to="/Voz" onClick={() => setMenu(false)}>
                                            Voz
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/Articulacion" onClick={() => setMenu(false)}>
                                            Articulación
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/Fonemas" onClick={() => setMenu(false)}>
                                            Fonemas
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/Fluidez" onClick={() => setMenu(false)}>
                                            Fluidez
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/Memoria" onClick={() => setMenu(false)}>
                                            Memoria
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </li>
                        <li>
                            <Link to="/pacientes" onClick={() => setMenu(false)}>
                                Pacientes
                            </Link>
                        </li>
                        <li>
                            <Link to="/historial" onClick={() => setMenu(false)}>
                                Historial
                            </Link>
                        </li>
                        <li>
                            <Link to="/login" onClick={handleSignOut}>
                                Cerrar Sesión
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Navbar;
