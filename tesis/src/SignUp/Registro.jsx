import React, { useState } from 'react';
import './Registro.css';
const Registro = () => {
    const [formData, setFormData] = useState({
        dni: '',
        email: '',
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí puedes manejar el envío del formulario, por ejemplo, enviarlo a un servidor
        console.log('Datos del formulario:', formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="dni">DNI:</label>
                <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="email">Correo Electrónico:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="username">Nombre de Usuario:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Contraseña:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit">Registrarse</button>
        </form>
    );
};

export default Registro;