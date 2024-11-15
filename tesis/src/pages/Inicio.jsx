import React from 'react';
import '../styles/Inicio.css'
import { Button } from '@mui/material';

const Inicio = () => {

    const navigateToCategorias = () => {
        window.location.href = '/categorias';
    };

    return (
        <div className="inicio-container">
                <h1>Ludofono</h1>
            <main className="inicio-main">
                <p>Aplicación diseñada para fonoaudiologos infantiles</p>
                <Button variant='contained' color='success' onClick={navigateToCategorias}>Comenzar</Button>
            </main>
        </div>
    );
};


export default Inicio;