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




//Rutes
app.use('/api/usuarios',require('./routes/usuarios') );
app.use('/api/login',require('./routes/auth') );



app.listen( process.env.PORT, ()=>{
    console.log("server listening port ",process.env.PORT);
})