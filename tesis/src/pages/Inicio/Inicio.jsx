import React from 'react';
import './Inicio.css';

const Inicio = () => {

    const navigateToCategorias = () => {
        window.location.href = '/categorias';
    };

    return (
        <div className="inicio-container">
            <header className="inicio-header">
                <h1>Bienvenidos a la App</h1>
            </header>
            <main className="inicio-main">
                <p>Esta aplicación está diseñada para ayudar a los niños con sus habilidades de habla y lenguaje.</p>
                <button className="inicio-button" onClick={navigateToCategorias}>Comenzar</button>
            </main>
        </div>
    );
};


export default Inicio;