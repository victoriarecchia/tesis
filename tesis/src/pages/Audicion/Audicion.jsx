import React, { useEffect } from 'react';
import './Audicion.css';
const Audicion = () => {
    useEffect(() => {
        const letras = ['A', 'B', 'C', 'D', 'E', 'P']; // Puedes agregar más letras aquí

        letras.forEach(letra => {
            const div = document.createElement('div');
            div.textContent = letra;
            div.style.fontSize = '2rem';
            div.style.margin = '10px';
            div.style.cursor = 'pointer';
            div.onclick = () => reproducirLetra(letra);
            document.body.appendChild(div);
        });
    }, []);

    const reproducirLetra = (letra) => {
        const utterance = new SpeechSynthesisUtterance(letra);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div>
            <h1 className='titulo-audicion'>Haz clic en una letra para escuchar su sonido</h1>
        </div>
    );
};

export default Audicion;