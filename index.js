require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dbconection } = require('./database/config');


//Usuario mongodb
//mongoneabit ->>> cmongoneabit
const server = express();

server.use(cors());

server.use(express.json());


server.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Desplegando servidor de la práctica 3'
    });
});

dbconection();
//console.log(process.env);

//RUTAS API
server.use('/api/usuarios', require('./routes/usuariosRoute'));
server.use('/api/login', require('./routes/authRoute'));
server.use('/api/reportes', require('./routes/reportesRoute'));




server.listen(process.env.PORT, () => {
    console.log('El servidor se está ejecutando en el puerto: ' + process.env.PORT),
        console.log('Carlos Daniel Vargas Llamo')
})