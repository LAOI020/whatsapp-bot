//HOST + /api/bitacora-soporte

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fieldsValidator');


router.post(
    '/send-message',
    [
        check('sendTo', 'El numero de celular destino no puede estar vacio').not().isEmpty(),
        check('message', 'El mensaje no puede estar vacio').not().isEmpty(),
        fieldsValidator        
    ],

)


module.exports = router;