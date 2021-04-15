const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { getUsuarios, crearUsuario, actualizarUsario, borrarUsuario } = require('../controllers/usuarios');

const router = Router();

router.get( '/', validarJWT, getUsuarios);

router.post(
 '/',
 [
     check('nombre', 'El nombre es obligatorio').not().isEmpty(),
     check('password', 'Password obligatoria').not().isEmpty(),
     check('email', 'Email obligatorio').not().isEmpty(),
     validarCampos

 ], 
 crearUsuario
 );


 router.put('/:id',
 [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('role', 'El rol es obligatorio').not().isEmpty(),
    validarCampos     
 ]
 ,actualizarUsario);
 

 router.delete('/:id', validarJWT, borrarUsuario);

module.exports = router;