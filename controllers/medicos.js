const { response } = require('express');
const bcrypt  = require('bcryptjs');
const Medico = require('../models/medicos');
const { generarJWT } = require('../helpers/jwt');

const getMedicos = async (req, res)=>{

    const medicos = await Medico.find()
        .populate('usuario','nombre email').populate('hospital', 'nombre');

    res.json({
        ok:true,
        medicos
    });
}

const crearMedico = async (req, res=response)=>{
    const uid = req.uid;
    const medico = new Medico( { usuario:uid, ...req.body} );

    try {
        const medicoBD = await medico.save();
        res.json({
            ok:true,
            medico:medicoBD
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        });
    }
}


const actualizarMedico = async (req, res)=>{
    res.json({
        ok:true,
        msg:'act medico'
    });
}


const borrarMedico = async (req, res)=>{
    res.json({
        ok:true,
        msg:'borrar medico'
    });
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}