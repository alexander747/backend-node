const Usuario = require('../models/usuario');
const Medico = require('../models/medicos');
const Hospital = require('../models/hospital');
const { findById } = require('../models/usuario');
const fs = require('fs');


const borrarImagen = (pathViejo)=>{
    if( fs.existsSync(pathViejo) ){
        // borrar la imagen anterior
        fs.unlinkSync(pathViejo);
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo)=>{
    let pathViejo = '';
    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);
            if( !medico ){
                console.log("no es un medico por id");
                return false;
            }

            pathViejo = `./uploads/medicos/${medico.img}`;
            borrarImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
        break;

        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if( !hospital ){
                console.log("no es un hospital por id");
                return false;
            }

            pathViejo = `./uploads/hospitales/${hospital.img}`;
            borrarImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
        break;

        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if( !usuario ){
                console.log("no es un usuario por id");
                return false;
            }

            pathViejo = `./uploads/usuarios/${usuario.img}`;
            borrarImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
        break;
    
        default:
            break;
    }

}
module.exports = { actualizarImagen }