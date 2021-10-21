const { response } = require('express');
const bcrypt  = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const usuario = require('../models/usuario');

const getUsuarios = async (req, res)=>{

    const desde = Number(req.query.desde) || 0 ;

    // //--------- const usuarios = await Usuario.find();
    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //     .skip( desde )
    //     .limit( 5 );
    // const total = await Usuario.count();    
    
    //PARA PAGINACIÓN SKIP Y LIMIT

    const [usuarios, total ] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
        .skip( desde )
        .limit( 5 ),
        Usuario.countDocuments()
    ]);



    res.json({
        ok:true,
        usuarios,
        uid:req.uid,
        total
    });
}

 
const crearUsuario = async (req, res = response)=>{

    const { email, password, nombre } = req.body;

    

    try {
        
        const existeEmail = await Usuario.findOne({ email:email });

        if(existeEmail){
            return res.status(400).json({
                ok:false,
                msg:'El correo ya está registrado'
            });
        }

        const usuario = new Usuario( req.body );
        //encriptar contrasña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt);
        // guardar usuario
        await usuario.save();

         // generar token
         const token = await generarJWT( usuario._id );

        res.json({
            ok:true,
            usuario:usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        });
    }

   
}

const actualizarUsario =async (req, res=response)=>{
    // validar token y comprobar si es el usuario correcto

    const uid = req.params.id;
    try {
        
        const usuarioDB = await Usuario.findById( uid );
        if( !usuarioDB ){
            return res.status(404).json({
                ok:false,
                msg:'El usuario no existe'
            });
        }


        // actualizamos
        // quita password y google de campos 
        // nos ahorramos esto :
        // delete campos.password;
        // delete campos.google;

        const { password, google, email, ...campos} = req.body;

        if( usuarioDB.email !== email ){
             const existeEmail = await Usuario.findOne({ email:email });
             if( existeEmail ){
                 return res.status(400).json({
                     ok:false,
                     msg:'Ya existe un usuario con el email'
                 });
             }
        }

        // para que solo se pueda actulizar usuario que no sea logueado por google
        if( !usuarioDB.google ){
            campos.email = email; 
        }else if( usuarioDB.email !== email ){
            return res.status(400).json({
                ok:false,
                msg:'Usuario de google no puede cambiar su correo'
            });
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new:true } );




        res.json({
            ok:true,
            usuarioActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Error inesperado'
        });
    }
}

const borrarUsuario = async (req, res=response)=>{
    const uid = req.params.id;
    console.log(uid);

    try {
        const usuarioDB = await Usuario.findById( uid );

        if( !usuarioDB ){
            return res.status(404).json({
                ok:false,
                msg:'No existe el usuario'
            });
        }

        await Usuario.findByIdAndDelete( uid );

        res.status(200).json({
            ok:true,
            msg:'Usuario eliminado'
        }); 
    } catch (error) {
     console.log(error);   
     res.status(500).json({
         ok:false,
         msg:'Error inesperado'
     });
    }

}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsario,
    borrarUsuario
}
