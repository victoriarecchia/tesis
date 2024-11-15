// // // const express = require('express');
// // // const router = express.Router();
// // // const Historial = require('../schema/historialSchema');
// // // const Paciente = require('../schema/pacienteSchema');

// // // router.post('/', async (req, res) => {
// // //     const { dni, juego, resultado, comentario, fecha } = req.body;
// // //     try {
// // //         const paciente = await Paciente.findOne({ dni });  // Buscar por DNI
// // //         if (!paciente) {
// // //             return res.status(404).json({ message: "Paciente no encontrado" });
// // //         }
        
// // //         // Guardar historial con DNI
// // //         const nuevoHistorial = new Historial({
// // //             dni,  // Usamos solo el DNI
// // //             juego,
// // //             resultado,
// // //             comentario,
// // //             fecha: fecha ? new Date(fecha) : Date.now(),
// // //         });

// // //         await nuevoHistorial.save();
// // //         res.status(201).json({ message: "Resultado guardado exitosamente" });
// // //     } catch (error) {
// // //         console.error("Error al guardar el resultado:", error);
// // //         res.status(500).json({ message: "Hubo un error al guardar el resultado" });
// // //     }
// // // });


// // // // router.get('/:pacienteId', async (req, res) => {
// // // //     const { pacienteId } = req.params;
// // // //     if (!pacienteId) {
// // // //         return res.status(400).json({ error: 'Paciente ID es requerido' });
// // // //     }

// // // //     try {
// // // //         const historial = await Historial.find({ pacienteId })
// // // //             .populate('pacienteId', 'nombre apellido dni')
// // // //             .sort({ fecha: -1 });

// // // //         if (historial.length === 0) {
// // // //             return res.status(404).json({ message: "No se encontraron historiales para este paciente" });
// // // //         }

// // // //         const historialAgrupado = historial.reduce((acc, partida) => {
// // // //             if (!acc[partida.juego]) {
// // // //                 acc[partida.juego] = [];
// // // //             }
// // // //             acc[partida.juego].push(partida);
// // // //             return acc;
// // // //         }, {});

// // // //         const ultimasPartidas = {};
// // // //         for (const juego in historialAgrupado) {
// // // //             ultimasPartidas[juego] = historialAgrupado[juego].slice(0, 3);
// // // //         }

// // // //         res.json(ultimasPartidas);
// // // //     } catch (error) {
// // // //         console.error("Error al obtener el historial:", error);
// // // //         res.status(500).json({ message: "Hubo un error al obtener el historial" });
// // // //     }
// // // // });

// // // router.get('/:dni', async (req, res) => {
// // //     const { dni } = req.params;
// // //     if (!dni) {
// // //         return res.status(400).json({ error: 'DNI es requerido' });
// // //     }

// // //     try {
// // //         const historial = await Historial.find({ dni })  // Buscar historial por DNI
// // //             .populate('dni', 'nombre apellido dni')  // Relacionar con Paciente por DNI
// // //             .sort({ fecha: -1 });

// // //         if (historial.length === 0) {
// // //             return res.status(404).json({ message: "No se encontraron historiales para este paciente" });
// // //         }

// // //         // Agrupar el historial por juego
// // //         const historialAgrupado = historial.reduce((acc, partida) => {
// // //             if (!acc[partida.juego]) {
// // //                 acc[partida.juego] = [];
// // //             }
// // //             acc[partida.juego].push(partida);
// // //             return acc;
// // //         }, {});

// // //         // Limitar las últimas 3 partidas por juego
// // //         const ultimasPartidas = {};
// // //         for (const juego in historialAgrupado) {
// // //             ultimasPartidas[juego] = historialAgrupado[juego].slice(0, 3);
// // //         }

// // //         res.json(ultimasPartidas);
// // //     } catch (error) {
// // //         console.error("Error al obtener el historial:", error);
// // //         res.status(500).json({ message: "Hubo un error al obtener el historial" });
// // //     }
// // // });

// // // module.exports = router;

// // const express = require('express');
// // const router = express.Router();
// // const Historial = require('../schema/historialSchema');
// // const Paciente = require('../schema/pacienteSchema');

// // // Guardar un nuevo historial de juego
// // router.post('/', async (req, res) => {
// //     const { dni, juego, resultado, comentario, fecha } = req.body;
// //     try {
// //         const paciente = await Paciente.findOne({ dni });
// //         if (!paciente) {
// //             return res.status(404).json({ message: "Paciente no encontrado" });
// //         }
// //         const nuevoHistorial = new Historial({
// //             dni,  
// //             juego,
// //             resultado,
// //             comentario,
// //             fecha: fecha ? new Date(fecha) : Date.now(),
// //         });

// //         await nuevoHistorial.save();
// //         res.status(201).json({ message: "Resultado guardado exitosamente" });
// //     } catch (error) {
// //         console.error("Error al guardar el resultado:", error);
// //         res.status(500).json({ message: "Hubo un error al guardar el resultado" });
// //     }
// // });

// // router.get('/:dni', async (req, res) => {
// //     const { dni } = req.params;
// //     if (!dni) {
// //         return res.status(400).json({ error: 'DNI es requerido' });
// //     }

// //     try {
// //         const historial = await Historial.find({ dni })
// //             .populate('dni', 'nombre apellido dni')  
// //             .sort({ fecha: -1 });

// //         if (historial.length === 0) {
// //             return res.status(404).json({ message: "No se encontraron historiales para este paciente" });
// //         }

// //         const historialAgrupado = {};
// //         historial.forEach((partida) => {
// //             const juego = partida.juego;
// //             if (!historialAgrupado[juego]) {
// //                 historialAgrupado[juego] = [];
// //             }
// //             historialAgrupado[juego].push(partida);
// //         });

// //         const ultimasPartidas = {};
// //         for (const juego in historialAgrupado) {
// //             ultimasPartidas[juego] = historialAgrupado[juego].slice(0, 3);
// //         }

// //         res.json(ultimasPartidas);
// //     } catch (error) {
// //         console.error("Error al obtener el historial:", error);
// //         res.status(500).json({ message: "Hubo un error al obtener el historial" });
// //     }
// // });

// // module.exports = router;


// const express = require('express');
// const router = express.Router();
// const Historial = require('../schema/historialSchema');
// const Paciente = require('../schema/pacienteSchema');

// // Guardar un nuevo historial de juego
// router.post('/', async (req, res) => {
//     const { dni, juego, resultado, comentario, fecha } = req.body;
//     try {
//         const paciente = await Paciente.findOne({ dni });
//         if (!paciente) {
//             return res.status(404).json({ message: "Paciente no encontrado" });
//         }
//         const nuevoHistorial = new Historial({
//             dni,  
//             juego,
//             resultado,
//             comentario,
//             fecha: fecha ? new Date(fecha) : Date.now(),
//         });

//         await nuevoHistorial.save();
//         res.status(201).json({ message: "Resultado guardado exitosamente" });
//     } catch (error) {
//         console.error("Error al guardar el resultado:", error);
//         res.status(500).json({ message: "Hubo un error al guardar el resultado" });
//     }
// });

// // Obtener historial de un paciente por DNI
// router.get('/:dni', async (req, res) => {
//     const { dni } = req.params;
//     if (!dni) {
//         return res.status(400).json({ error: 'DNI es requerido' });
//     }

//     try {
//         const historial = await Historial.find({ dni })
//             .sort({ fecha: -1 });  // Ordena por fecha descendente

//         if (historial.length === 0) {
//             return res.status(404).json({ message: "No se encontraron historiales para este paciente" });
//         }

//         // Agrupar las partidas por juego
//         const historialAgrupado = historial.reduce((acc, partida) => {
//             const juego = partida.juego;
//             if (!acc[juego]) {
//                 acc[juego] = [];
//             }
//             acc[juego].push(partida);
//             return acc;
//         }, {});

//         // Limitar a las 3 últimas partidas por juego
//         const ultimasPartidas = Object.keys(historialAgrupado).reduce((acc, juego) => {
//             acc[juego] = historialAgrupado[juego].slice(0, 3);
//             return acc;
//         }, {});

//         res.json(ultimasPartidas);
//     } catch (error) {
//         console.error("Error al obtener el historial:", error.message);
//         res.status(500).json({ message: "Hubo un error al obtener el historial" });
//     }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Historial = require('../schema/historialSchema');
const Paciente = require('../schema/pacienteSchema');

// Guardar un nuevo historial de juego
router.post('/', async (req, res) => {
    const { dni, juego, resultado, comentario, tiempo, fecha } = req.body;
    try {
        const paciente = await Paciente.findOne({ dni });
        if (!paciente) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }
        const nuevoHistorial = new Historial({
            dni,  
            juego,
            resultado,
            tiempo,
            comentario,
            fecha: fecha ? new Date(fecha) : Date.now(),
        });

        await nuevoHistorial.save();
        res.status(201).json({ message: "Resultado guardado exitosamente" });
    } catch (error) {
        console.error("Error al guardar el resultado:", error);
        res.status(500).json({ message: "Hubo un error al guardar el resultado" });
    }
});

router.get('/:dni', async (req, res) => {
    const { dni } = req.params;
    if (!dni) {
        return res.status(400).json({ error: 'DNI es requerido' });
    }

    try {
        const historial = await Historial.find({ dni })
            .sort({ fecha: -1 }); 

        if (historial.length === 0) {
            return res.status(200).json({ message: "No hay historial disponible para este paciente" });
        }

        // Agrupar las partidas por juego
        const historialAgrupado = historial.reduce((acc, partida) => {
            const juego = partida.juego;
            if (!acc[juego]) {
                acc[juego] = [];
            }
            acc[juego].push(partida);
            return acc;
        }, {});

        // Limitar a las 3 últimas partidas por juego
        const ultimasPartidas = Object.keys(historialAgrupado).reduce((acc, juego) => {
            acc[juego] = historialAgrupado[juego].slice(0, 3);
            return acc;
        }, {});

        res.json(ultimasPartidas);
    } catch (error) {
        console.error("Error al obtener el historial:", error.message);
        res.status(500).json({ message: "Hubo un error al obtener el historial" });
    }
});

module.exports = router;
