const express = require('express');

const app = express();
const path = require('path');
const fs = require('fs');

// Rutas
app.get('/:model/:img', (req, res, next) => {

    const model = req.params.model;
    const img = req.params.img;
    const pathImage = path.resolve(__dirname, `../uploads/${model}/${img}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const pathNoImage = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(pathNoImage);

    }

});

module.exports = app;