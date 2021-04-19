const { response } = require('express');
const bcrypt  = require('bcryptjs');
const Hospital = require('../models/hospital');
const { generarJWT } = require('../helpers/jwt');

const getHospitales = async (req, res=response)=>{

    const hospitales = await Hospital.find()
        .populate('usuario','nombre email ');

    res.json({
        ok:true,
        hospitales
    });
}

const crearHospitales = async (req, res=response)=>{
    const uid = req.uid;
    const hospital = new Hospital({ usuario:uid, ...req.body});

    try {
        
      const hospitalDB = await hospital.save();
        res.json({
            ok:true,
            hospital: hospitalDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'error inesperado'
        });
    }


}


const actualizarHospitales = async (req, res)=>{
    res.json({
        ok:true,
        msg:'act hospitales'
    });
}


const borrarHospitales = async (req, res)=>{
    res.json({
        ok:true,
        msg:'borrar hospitales'
    });
}


module.exports = {
    getHospitales,
    crearHospitales,
    actualizarHospitales,
    borrarHospitales
}