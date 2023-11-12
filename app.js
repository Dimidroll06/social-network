const express = require('express');
const { port } = require('./lib/config');
const mongooseConfig = require('./lib/mongoose-config');
const initPassport = require('./lib/passport-config');

const logger = require('morgan');
const passport = require('passport');
const api = require('./routes/index');
const cors = require('cors');

module.exports = async (cb) => {
    const app = express();
    await mongooseConfig();

    app.use(logger('dev'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cors({
        origin: '*'
    }));

    app.use('/files', express.static('./public'));

    initPassport(passport);
    app.use(passport.initialize());

    app.use('/api', api);

    app.listen(port, cb);
    return app;
}