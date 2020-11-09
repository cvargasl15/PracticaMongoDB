const { response, request } = require('express');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');

const Usuario = require('../models/usuarioModel');


const getUsuarios = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const limite = Number(req.query.limite) || 0;
    // Este codigo es similar la que esta lineas abajo, solo que este usa dos promesas una
    // a continuación de la otra, para evitar esto se utiliza el codigo propuesto
    // console.log(desde);
    // console.log(limite);
    // const usuarios = await Usuario.find({}, 'nombre email role google')
    //     .skip(desde)
    //     .limit(limite);

    // const total = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nickname nombre email role password img').skip(desde).limit(limite),
        Usuario.countDocuments()
    ]);



    res.json({
        ok: true,
        msg: 'obtener usuarios',
        usuarios,
        total

    });
}

const crearUsuario = async(req, res = response) => {

    //console.log(req.body);
    const { nickname, password } = req.body;

    try {

        const existenickname = await Usuario.findOne({ nickname });
        if (existenickname) {
            return res.status(400).json({
                ok: false,
                msg: 'El nickname ya esta registrado  '
            });
        }

        const usuario = new Usuario(req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        //guardar usuario con password encriptado
        await usuario.save();

        //Generar el TOKEN
        const token = await generateJWT(usuario.id);



        res.json({
            ok: true,
            msg: 'Creando usuario',
            usuario,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!!!!!! Revisar logs'
        });
    }
}

const actualizarUsuario = async(req, res = response) => {

    const uid = req.params.id;


    try {
        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con este id'
            });
        }
        //Actualizaciones
        const { password, google, nickname, ...campos } = req.body;

        if (usuarioDB.nickname != nickname) {

            const existenickname = await Usuario.findOne({ nickname });
            if (existenickname) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese nickname'
                });
            }
        }
        campos.nickname = nickname;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, { new: true });


        res.json({
            ok: true,
            usuario: usuarioActualizado
        });


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado!!!!!! Revisar logs'
        });
    }

}

const eliminarUsuario = async(req, res = response) => {
    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById(uid);

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con este id'
            });
        }
        await Usuario.findByIdAndDelete(uid);

        res.status(200).json({
            ok: true,
            msg: 'Usuario eliminado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: ' Error en eliminar usuario, comunicar al dba'
        });
    }



}


module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario,
}