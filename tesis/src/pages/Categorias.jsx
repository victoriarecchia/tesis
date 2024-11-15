import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Categorias.css'

const categorias = [
    { id: 1, nombre: 'Articulacion', descripcion: 'Ejercicios para mejorar la articulación del habla.' },
    { id: 2, nombre: 'Memoria', descripcion: 'Actividades para fomentar el desarrollo de la memoria' },
    { id: 3, nombre: 'Voz', descripcion: 'Prácticas para controlar y mejorar la voz.' },
    { id: 4, nombre: 'Fluidez', descripcion: 'Ejercicios para mejorar la fluidez al hablar.' },
    { id: 5, nombre: 'Fonemas', descripcion: 'Juegos para practicar fonemas específicos.' }
];

const Categorias = () => {
    return (
        <div className='categorias-container'>
            <h1 className='titulo'>Juegos de Fonoaudiología</h1>
            <ul className='listaCategorias'>
                {categorias.map(categoria => (
                    <li key={categoria.id} className='categoria'>
                        <Link to={`/${categoria.nombre}`} className='category-link'>
                            <span className='category-name'>{categoria.nombre}</span>
                        </Link>
                        <p className='category-description'>{categoria.descripcion}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categorias;
