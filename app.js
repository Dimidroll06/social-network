const express = require('express');
const { port } = require('./lib/config');
const mongooseConfig = require('./lib/mongoose-config');

const logger = require('morgan');
const clearExpiredTokenWorker = require('./lib/clear-expired-tokens');

const cors = require('cors');
const cookie = require('cookie-parser');
const api = require('./routes/index');

module.exports = async (cb) => {
    const app = express();
    await mongooseConfig();

    clearExpiredTokenWorker.start();

    app.use(logger('dev'));

    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookie());
    
    app.use(cors({
        origin: '*'
    }));

    app.use('/files', express.static('./public'));

    app.use('/api', api);

    app.listen(port, cb);
    return app;
}