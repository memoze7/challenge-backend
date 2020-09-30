// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Initializer variables
var app = express();

//CORS ENABLE

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

//Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());


// Importar rutas
var appRoutes = require('./routes/app');
var appUsuarioRoutes = require('./routes/usuario');
var appPropiedadesRoutes = require('./routes/propiedades');
var appBuscarRoutes = require('./routes/buscar');
var appLoginRoutes = require('./routes/login');
var appUploadRoutes = require('./routes/upload');
var appImgRoutes = require('./routes/imagen')

// Conexión a la ba se de datos
mongoose.connection.openUri('mongodb://localhost:27017/challengeDB', (err, res) => {


    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');


});

// Rutas
app.use('/usuario', appUsuarioRoutes);
app.use('/propiedades', appPropiedadesRoutes);
app.use('/buscar', appBuscarRoutes);
app.use('/login', appLoginRoutes);
app.use('/upload', appUploadRoutes);
app.use('/img', appImgRoutes);
app.use('/', appRoutes);

// escuchar peticiones
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');

})