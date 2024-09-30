import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import Login from '../Login/Login';
const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">App</Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/login">Iniciar Sesión</Link>
                </li>
                <li>
                    <Link to="/registro">Registrarse</Link>
                </li>
                <li>
                    <Link to="/categorias">Categorías</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;