const { response } = require('express');
const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');



const getTodo = async (req, res=response)=>{
const busqueda = req.params.busqueda;
const expresionRegular = new RegExp( busqueda, 'i' ); //i de insensible para que busque todo 
const [usuarios, medicos, hospitales ] = await Promise.all([
    Usuario.find({ nombre:expresionRegular }),
    Medico.find({ nombre:expresionRegular }),
    Hospital.find({ nombre:expresionRegular })
]);

  return res.json({
        ok:true,
        usuarios,
        medicos,
        hospitales
    });


}

const getDocumentoColeccion = async (req, res=response)=>{
    const tabla = req.params.tabla;
    const busqueda = req.params.busqueda;
    const expresionRegular = new RegExp( busqueda, 'i' ); //i de insensible para que busque todo 

    let data = [];

    switch(tabla){
        case 'medicos':
             data = await Medico.find({ nombre:expresionRegular }).populate('usuario','nombre img').populate('hospital','nombre img');
        break;
        
        case 'hospitales':
             data = await Hospital.find({ nombre:expresionRegular }).populate('usuario', 'nombre img');
        break;

        case 'usuarios':
              data = await Usuario.find({ nombre:expresionRegular });
        break;
            
        default:
           return res.status(400).json({
                ok:false,
                msg:'Error, la ruta tiene que ser medicos/hospitales/usuarios'
           });    
    }

    res.status(200).json({
        ok:true,
        resultados:data
    });
    
    
    }

module.exports = { getTodo, getDocumentoColeccion };