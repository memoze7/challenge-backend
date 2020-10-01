const express = require('express');
const app = express();

const Propiedad = require('../models/propiedad')
const Usuario = require('../models/usuario')

// Rutas

// ==============================
// Busqueda por colección
// ==============================
app.get('/coleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'propiedades':
            promesa = buscarPropiedad(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, y propiedades2',
                error: {
                    message: 'Tipo de tabla/coleccion no válido'
                }
            });

    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});



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
                },
                {
                    'titulo': regex
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

        Usuario.find({}, 'nombre email role img')
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