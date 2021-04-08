const express = require('express');
require('dotenv').config();
const cors = require('cors');

const { dbConection } = require('./database/config');

// create server
const app = express();

//configurar cors
app.use(cors());

//CONEXION DB
dbConection();




//Rutes
app.get( '/', (req, res)=>{
    res.json({
        ok:true,
        msg:'Hola mundo'
    });
} );

app.listen( process.env.PORT, ()=>{
    console.log("server listening port ",process.env.PORT);
})