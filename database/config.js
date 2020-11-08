const mongoose = require('mongoose');

const dbconection = async() => {
    try {
        await mongoose.connect(process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Conexión exitosa a VargasDB');
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión a VargasDB');
    }
}

module.exports = {
    dbconection
}