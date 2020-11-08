const express = require('express');
const { dbconection } = require('./database/config');
require('dotenv').config();
const cors = require('cors');
//Usuario mongodb
//mongoneabit ->>> cmongoneabit
const server = express();
server.use(cors());

server.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Desplegando servidor de la práctica 3'
    });
});

dbconection();
//console.log(process.env);

server.listen(process.env.PORT, () => {
    console.log('El servidor se está ejecutando en el puerto: ' + process.env.PORT),
        console.log('Carlos Daniel Vargas Llamo')
})