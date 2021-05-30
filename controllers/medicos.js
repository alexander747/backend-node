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

const getMedicoById = async (req, res)=>{
    const id = req.params.id;

    try {
        const medico = await Medico.findById(id)
        .populate('usuario','nombre img')
        .populate('hospital', 'nombre img');

    res.json({
        ok:true,
        medico
    });
    } catch (error) {
        
    res.json({
        ok:false,
        msg:'medico no encontrado',
        error:error
    });
    }

   
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
    const idMedico = req.params.id;
    const uid = req.uid;
    const { nombre, hospital } = req.body;

    try {
        const medico = await Medico.findById( idMedico );
        if( !medico ){
            return res.status(404).json({
                ok:false,
                msg:'medico no existe por id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario:uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( idMedico, cambiosMedico, {new:true});
        
        res.json({
            ok:true,
            medico:medicoActualizado,
        });


    } catch (error) {
        res.status(500).json({
            ok:false,
            medico:'Error inesperado',
        });
    }


  
}


const borrarMedico = async (req, res)=>{
    const idMedico = req.params.id;

    try {
        const medico = await Medico.findById( idMedico );
        if( !medico ){
            return res.status(404).json({
                ok:false,
                msg:'medico no existe por id'
            });
        }

       await Medico.findByIdAndDelete(idMedico);

        res.json({
            ok:true
        });


    } catch (error) {
        res.status(500).json({
            ok:false,
            medico:'Error inesperado',
        });
    }
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico,
    getMedicoById
}