const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();

app.use(fileUpload());

// modelos
const Propiedad = require('../models/propiedad');
const Usuario = require('../models/usuario');


// Rutas
app.put('/:modelo/:id', (req, res, next) => {

    const modelo = req.params.modelo;
    const id = req.params.id;

    // modelos
    const modelos = ['propiedades', 'usuarios'];
    if (modelos.indexOf(modelo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'modelo no valido',
            errors: {
                message: `los modelos validos son ${modelos.join(', ')}`
            }
        })
    }


    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó ningún archivo',
            errors: {
                message: 'Debe seleccionar un archivo'
            }
        })
    }

    // Obtener nombre del archivo

    const archivo = req.files.imagen;
    const extension = archivo.name.split('.').pop()

    // extensiones
    const extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensiones no valida',
            errors: {
                message: `Las extensiones validas son ${extensionesValidas.join(', ')}`
            }
        })
    }

    // Cambiar nombre de archivo
    const nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // guardar el archivo en un path
    const path = `./uploads/${ modelo }/${ nombreArchivo }`;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            })
        }
    });

    subirPorModelo(modelo, id, nombreArchivo, res)

    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Petición realizada correctamente - uploads',

    // })
});

function subirPorModelo(modelo, id, nombreArchivo, res) {
    switch (modelo) {
        case 'usuarios':
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

                const pathViejo = `./uploads/usuarios/${usuario.img}`;

                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            console.log("failed to delete local image:" + err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    });
                };
                usuario.img = nombreArchivo;
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

            })
            break;
        case 'propiedades':
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

                var pathViejo = `./uploads/propiedades/${propiedad.fotografia}`;
                if (fs.existsSync(pathViejo)) {
                    fs.unlink(pathViejo, (err) => {
                        if (err) {
                            console.log("failed to delete local image:" + err);
                        } else {
                            console.log('successfully deleted local image');
                        }
                    });
                };
                console.log('pathViejo :>> ', pathViejo);


                propiedad.fotografia = nombreArchivo;

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



            break;

        default:
            return 'modelo no valido'
            break;
    }
}

module.exports = app;