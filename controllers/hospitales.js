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

    const idHospital = req.params.id;
    const uid = req.uid;

    try {
        
        const hospital = await Hospital.findById( idHospital );

        if( !hospital ){
            return res.status(404).json({
                ok:false,
                msg:'Hospital no encontrado por id'
            });
        }

        // actualizar
        // Hospital.nombre = req.body.nombre; cuando ////hay un campo por actualizar

        const cambiosHospital = {
            ...req.body,
            usuario:uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( idHospital, cambiosHospital, {new:true} );

        res.status(200).json({
            ok:true,
            hospital:hospitalActualizado
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        });
    }

}


const borrarHospitales = async (req, res)=>{
    const idHospital = req.params.id;

    try {
        
        const hospital = await Hospital.findById( idHospital );

        if( !hospital ){
            return res.status(404).json({
                ok:false,
                msg:'Hospital no encontrado por id'
            });
        }

        await Hospital.findByIdAndDelete( idHospital );
        
        res.status(200).json({
            ok:true
        });

    } catch (error) {
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        });
    }
}


module.exports = {
    getHospitales,
    crearHospitales,
    actualizarHospitales,
    borrarHospitales
}