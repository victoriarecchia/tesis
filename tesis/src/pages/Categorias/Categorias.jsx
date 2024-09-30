import React from 'react';
import './Categorias.css'

const categorias = [
    { id: 1, nombre: 'Articulacion' },
    { id: 2, nombre: 'Lenguaje' },
    { id: 3, nombre: 'Voz' },
    { id: 4, nombre: 'Fluidez' },
    { id: 5, nombre: 'Audicion' }
];

const Categorias = () => {
    return (
        <div className='categorias-container'>
            <h1 className='category-list-title'>Categorías de Juegos de Fonoaudiología</h1>
            <ul className='category-list'>
                {categorias.map(categoria => (
                    <li key={categoria.id} className='category-item'>
                        <a href={`${categoria.nombre}`}>{categoria.nombre}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categorias;