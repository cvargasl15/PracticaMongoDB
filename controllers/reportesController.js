const { response } = require('express');
const Reporte = require('../models/reporteModel');

const getReportes = async(req, res = response) => {

    const reportes = await Reporte.find().populate('usuario', 'fecha');


    res.json({
        ok: true,
        reportes
    });
}
const crearReporte = async(req, res = response) => {
    const uid = req.uid;

    const reporte = new Reporte({
        usuario: uid,
        ...req.body
    });

    try {

        const reporteDB = await reporte.save();
        res.json({
            ok: true,
            reporte: reporteDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({

            ok: false,
            msg: 'Error inesperado hablar con el administrador'
        });
    }


}
const actualizarReporte = async(req, res = response) => {

    const id = req.params.id;
    const uid = req.uid;

    try {

        const reporte = await Reporte.findById(id);
        if (!reporte) {
            return res.status(404).json({
                ok: true,
                msg: 'Reporte no existe'

            });
        }

        const cambiosReporte = {
            ...req.body,
            usuario: uid
        }

        const reporteActualizado = await Reporte.findByIdAndUpdate(id, cambiosReporte, { new: true });

        return res.json({
            ok: true,
            reporte: reporteActualizado

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperados hable con el administrador'
        });
    }


}
const eliminarReporte = async(req, res = response) => {
    const id = req.params.id;

    try {

        const reporte = await Reporte.findById(id);
        if (!reporte) {
            return res.status(404).json({
                ok: true,
                msg: 'Reporte no existe'

            });
        }

        await Reporte.findByIdAndDelete(id);
        return res.json({
            ok: true,
            msg: 'Reporte Eliminado'

        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperados hable con el administrador'
        });
    }
}


module.exports = {
    getReportes,
    crearReporte,
    actualizarReporte,
    eliminarReporte
}