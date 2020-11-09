/*
    Reportes
    ruta: /api/reportes
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../midlewares/validarCampos');

const { validarJWT } = require('../midlewares/validarJWT');
const { getReportes, actualizarReporte, eliminarReporte, crearReporte } = require('../controllers/reportesController');


const router = Router();

router.get('/', getReportes);


router.post('/', [
        validarJWT,
        check('fecha', 'La fecha del reporte es obligatorio').not().isEmpty(),
        validarCampos
    ],
    crearReporte);

router.put('/:id', [
        validarJWT,
        check('fecha', 'La fecha del reporte es obligatoria').not().isEmpty(),
        validarCampos
    ],
    actualizarReporte);

router.delete('/:id',
    validarJWT,
    eliminarReporte);



module.exports = router; //para exportar