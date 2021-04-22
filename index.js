const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConection } = require('./database/config');

// create server
const app = express();

//configurar cors
app.use( cors() );

//lectura y parseo del body
app.use( express.json() );

//CONEXION DB
dbConection();

//DIRECTORIO PUBLICO
app.use( express.static('public') );



//Rutes
app.use('/api/usuarios',require('./routes/usuarios') );
app.use('/api/hospitales',require('./routes/hospitales') );
app.use('/api/medicos', require('./routes/medicos') );
app.use('/api/login',require('./routes/auth') );
app.use('/api/busquedas',require('./routes/busquedas') );
app.use('/api/upload',require('./routes/uploads') );





app.listen( process.env.PORT, ()=>{
    console.log("server listening port ",process.env.PORT);
})