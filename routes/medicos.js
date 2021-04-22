const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

router.get( '/', validarJWT, getMedicos);

router.post(
 '/',
 [
     validarJWT,
     check('nombre','El nombre es necesario').not().isEmpty(),
     check('hospital','El hospital id es neceario').isMongoId(),
     validarCampos
 ], 
 crearMedico
 );


 router.put('/:id',
 [
    validarJWT,
    check('nombre','El nombre es necesario').not().isEmpty(),
    check('hospital','El hospital id es neceario').isMongoId(),
    validarCampos
 ]
 ,actualizarMedico);
 

 router.delete('/:id', validarJWT, borrarMedico);

module.exports = router;