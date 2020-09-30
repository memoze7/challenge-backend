var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var propiedadSchema = new Schema({

    fotografia: {
        type: String,
        required: false
    },
    titulo: {
        type: String,
        required: [true, 'El titulo es necesaría']
    },
    direccion: {
        type: String,
        required: [true, 'La dirección es necesaría']
    },
    ciudad: {
        type: String,
        required: [true, 'La ciudad es necesaría']
    },
    pais: {
        type: String,
        required: [true, 'El país es necesarío']
    },
    habitaciones: {
        type: Number,
        required: [true, 'El número de habitaciones es necesarío']
    },
    banios: {
        type: Number,
        required: [true, 'El número de baños es necesarío']
    },
    precio: {
        type: Number,
        required: false
    },
    reviewCount: {
        type: Number,
        required: false,
    },
    calificación: {
        type: Number,
        required: false,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    updated_at: {
        type: String,
        required: true
    }

}, {
    collection: 'propiedades'
});

module.exports = mongoose.model('Propiedad', propiedadSchema);