const express = require('express');


const app = express();
const Propiedad = require('../models/propiedad');
var mdAuthentication = require('../middleware/middleware');



// Obtener todos los proiedades

app.get('/', (req, res, next) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);


    Propiedad.find({})
        .skip(desde)
        .limit(10)
        .populate('usuario', 'nombre email')
        .exec(
            (err, propiedad) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando las propiedades',
                        errors: err
                    })
                }
                Propiedad.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando las propiedades',
                            errors: err
                        })
                    }
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        propiedad
                    })
                });
            })
});

// Actualizar un nuevo propiedad
app.put('/:id', mdAuthentication.verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;


    Propiedad.findById(id, (err, propiedad) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar propiedad',
                errors: err
            })
        }

        if (!propiedad) {
            return res.status(400).json({
                ok: false,
                mensaje: `La propiedad con el id: ${id} no existe`,
                errors: {
                    message: 'No existe la Propiedad con ese ID'
                }
            })
        }

        propiedad.titulo = body.titulo;
        propiedad.direccion = body.direccion;
        propiedad.ciudad = body.ciudad;
        propiedad.pais = body.pais;
        propiedad.habitaciones = body.habitaciones;
        propiedad.banios = body.banios;
        propiedad.calificación = body.calificación,
            propiedad.precio = body.precio,
            propiedad.usuario = req.usuario._id;
        propiedad.updated_at = new Date();

        propiedad.save((err, propiedad) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar Propiedad',
                    errors: err
                })
            }

            res.status(200).json({
                ok: true,
                propiedad
            })



        })


    });

})


// Crear un nuevo propiedad
app.post('/', mdAuthentication.verificaToken, (req, res) => {
    const body = req.body;

    const propiedad = new Propiedad({
        titulo: body.titulo,
        direccion: body.direccion,
        ciudad: body.ciudad,
        pais: body.pais,
        habitaciones: body.habitaciones,
        banios: body.banios,
        calificación: body.calificación,
        precio: body.precio,
        usuario: req.usuario._id,
        updated_at: new Date()
    });

    propiedad.save((err, propiedad) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear propiedad',
                errors: err
            })
        }


        res.status(201).json({
            ok: true,
            propiedad
        })



    })


});

// Eliminar una propiedad por el id
app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {
    const id = req.params.id;

    Propiedad.findByIdAndRemove(id, (err, propiedad) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar propiedad',
                errors: err
            })
        }

        if (!propiedad) {
            return res.status(400).json({
                ok: false,
                mensaje: `La propiedad con el id: ${id} no existe`,
                errors: {
                    message: 'No existe una propiedad con ese ID'
                }
            })
        }

        res.status(200).json({
            ok: true,
            propiedad
        })
    })
})


module.exports = app;