const config = require('../lib/config');

const axios = require('axios').default;

module.exports = {
    axios: axios.create({
        baseURL: `http://localhost:${config.port}/api`,
        validateStatus: () => true // don't throw errors
    })
}
