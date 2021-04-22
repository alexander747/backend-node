const { response } = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res=response)=>{
    const { email, password } = req.body;

    try {
        
        // verificar email
        const usuarioDB = await Usuario.findOne({ email });
        if( !usuarioDB ){
            return res.status(404).json({
                ok:false,
                msg:'Email no encontrado'
            });
        }

        // verificar password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if( !validPassword ){
            return res.status(404).json({
                ok:false,
                 msg:'Password invalida'
            });
        }

        // generar token
        const token = await generarJWT( usuarioDB._id );

        res.json({
            ok:true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado _',
            error
        });
    }
}

const googleSignIn =async (req, res=response)=>{

    const googleToken = req.body.token;

    try {
       const { name, email, picture} = await googleVerify(googleToken);
        
       //verificamos si el usuario existe en la db con el correo
       const usuarioDB = await Usuario.findOne( {email} );
       let usuario;
    //    si no exsite el usuario
        if( !usuarioDB ){
            usuario = new Usuario({
                nombre: name,
                email,
                password:'@@@',
                img:picture,
                google:true
            })
        }else{
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
            // usuario.password = '@@@'
        }

        // guardar en la bd
        await usuario.save();

        // generar token
        const token = await generarJWT( usuario.id );

        res.status(200).json({
            ok:true,
            msg:'google sign in',
            token
        });
    } catch (error) {
        res.status(401).json({
            ok:false,
            msg:'Token incorrecto'
        });
    }

    
}


const renewToken = async (req, res=response)=>{

    const uid = req.uid;

    // generar token
    const token = await generarJWT( uid );

    res.status(200).json({
        ok:true,
        token
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}