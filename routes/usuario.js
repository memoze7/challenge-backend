const express = require('express');
const bcrypt = require('bcryptjs');

const app = express();
const Usuario = require('../models/usuario');
var mdAuthentication = require('../middleware/middleware');



// Obtener todos los usuarios

app.get('/', (req, res, next) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            (err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    })
                }

                Usuario.count({}, (err, conteo) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando usuarios',
                            errors: err
                        })
                    }

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        usuarios
                    });
                });
            })
});

// Actualizar un nuevo usuario
app.put('/:id', mdAuthentication.verificaToken, (req, res) => {
    const id = req.params.id;
    const body = req.body;


    Usuario.findById(id, (err, usuario) => {

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
                mensaje: `El usuario con el id: ${id} no existe`,
                errors: {
                    message: 'No existe un usuario con ese ID'
                }
            })
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuario) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                })
            }
            usuario.password = ':)';
            res.status(200).json({
                ok: true,
                usuario
            })



        })


    });

})


// Crear un nuevo usuario
app.post('/', (req, res) => {
    const body = req.body;

    const usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuario) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuarios',
                errors: err
            })
        }

        usuario.password = ':)';
        res.status(201).json({
            ok: true,
            usuario
        })



    })


});

// Eliminar un  usuario por el id
app.delete('/:id', mdAuthentication.verificaToken, (req, res) => {
    const id = req.params.id;

    usuario.findByIdAndRemove(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            })
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `El usuario con el id: ${id} no existe`,
                errors: {
                    message: 'No existe un usuario con ese ID'
                }
            })
        }

        res.status(200).json({
            ok: true,
            usuario
        })
    })
})


module.exports = app;