const mongoose = require('mongoose');

const config = require('./config');

module.exports = async () => {
    await mongoose
        .connect(config.mongoConnection)
        .catch((err) => console.log(err));

    console.log('MongoDB connected');
}