const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { dbConection } = require('./database/config');

// Crear el server de express
const app = express();

// Configuración de middleware para aumentar el límite del tamaño del cuerpo
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Base de datos
dbConection();

// CORS
app.use(cors());

// Directorio publico
app.use( express.static('public') ); // Aqui se montará todo el fronted de React

// Lectura y parseo del body
app.use( express.json() );

// Rutas de la app
// Auth routes
app.use('/api/auth', require('./routes/auth'));

// CRUD eventos routes
// GESTION DE USUARIOS
app.use('/api/admin', require('./routes/admin'));
app.use('/api/medico', require('./routes/medico'));
app.use('/api/enfermeria', require('./routes/enfermeria'));

// GESTION DE HISTORIAS CLINICAS
app.use('/api/historias', require('./routes/historias'));

// INGRESO DE PACIENTES
app.use('/api/ingreso', require('./routes/ingreso'));


/* app.use('*', (req, res) => {
    res.sendFile(path.join( __dirname, 'public/index.html' ));
}); */


// Escuchar peticiones ( process.env.PORT se usa para acceder nuestra variable
// de entorno en la que establecimos el puerto )
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});