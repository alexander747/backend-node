const path = require('path');
const { response } = require('express');
const { v4:uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');
const fs = require('fs');

const fileUpload = (req, res=response)=>{

    const tipo = req.params.tipo;
    const id = req.params.id;

    // validar tipo 
    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if( !tiposValidos.includes(tipo) ){
        return res.status(400).json({
            ok:false,
            msg:'No es un médico, Usuario u hospital (tipo)'
        });
    }

    // validar existe archivo
    if( !req.files || Object.keys(req.files).length ===0 ){
        return res.status(400).json({
            ok:false,
            msg:'No hay ningún archivo'
        });
    }

    //procesar imagen
    const file = req.files.imagen;

    const nombreCortado = file.name.split('.');
    const extensionArchivo = nombreCortado[ nombreCortado.length -1 ];

    //validar extensiones
    const extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'];
    if( !extensionesValidas.includes(extensionArchivo) ){
        return res.status(400).json({
            ok:false,
            msg:'No es una extesión permitida'
        });
    }

    //generar nombre del archivo
    const nombreArchivo = `${ uuidv4() }.${ extensionArchivo }`;

    //Path para generar imagen
    const path = `./uploads/${tipo}/${nombreArchivo}`;

    // Mover imagen
    file.mv( path, (err)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                ok:false,
                msg:'Error al mover la imagen'
            });
        }

    //  actualizar base de datos
    actualizarImagen( tipo, id, nombreArchivo );

        res.json({
            ok:true,
            msg:'Archivo subido',
            nombreArchivo
        });

    })    


    
}


const retornaImagen = (req, res=response)=>{
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    const pathImg = path.join(__dirname, `../uploads/${tipo}/${foto}`);

    // imagen por defecto 
    if( fs.existsSync(pathImg) ){
        res.sendFile(pathImg);
    }else{
        const pathImg = path.join(__dirname, `../uploads/no-image.png`);
        res.sendFile(pathImg);
    }

}

module.exports = { fileUpload, retornaImagen };