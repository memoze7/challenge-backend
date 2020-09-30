const express = require('express');
const app = express();

const Propiedad = require('../models/propiedad')
const Usuario = require('../models/usuario')

// Rutas
app.get('/todo/:search', (req, res, next) => {

    const search = req.params.search;
    const regEx = new RegExp(search, 'i')
    Promise.all([
        buscarPropiedad(search, regEx),
        buscarUsuarios(search, regEx)
    ]).then(resp => {

        res.status(200).json({
            ok: true,
            propiedad: resp[0],
            usuarios: resp[1]
        })
    })


});


function buscarPropiedad(buscar, regex) {

    return new Promise((resolve, reject) => {
        Propiedad.find({})
            .populate('usuario', 'nombre email')
            .or([{
                    'direccion': regex
                },
                {
                    'ciudad': regex
                },
                {
                    'pais': regex
                }

            ])
            .exec((err, propiedad) => {
                if (err) {
                    reject('Error al cargar hospitales', err)
                } else {
                    resolve(propiedad)
                }
            });
    });

}

function buscarUsuarios(buscar, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{
                'nombre': regex
            }, {
                'email': regex
            }])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Erro al cargar usuarios', err);
                } else {
                    resolve(usuarios);
                }


            })


    });
}


module.exports = app;