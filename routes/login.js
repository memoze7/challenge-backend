const express = require('express');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const app = express();
const SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    const body = req.body;

    Usuario.findOne({
        email: body.email
    }, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errors: err
            })
        }



        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `Credenciales incorrectas `,
                errors: {
                    message: 'Credenciales incorrectas'
                }
            })
        }


        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: `Credenciales incorrectas`,
                errors: {
                    message: 'Credenciales incorrectas'
                }
            })
        }

        usuario.password = ':)';

        var token = jwt.sign({
            usuario
        }, SEED, {
            expiresIn: 14400
        }); // 4 horas

        return res.status(200).json({
            ok: true,
            usuario,
            token,
            id: usuario._id
        });
    })
});

module.exports = app;