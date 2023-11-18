const config = require('../lib/config');

const axios = require('axios').default.create({
    baseURL: `http://localhost:${config.port}/api`,
    validateStatus: () => true // don't throw errors
});

module.exports = {
    axios: axios,
    
    testUser: {
        username: 'Potato_228',
        password: 'strongpassword',
        repeat_password: 'strongpassword'
    },

    async auth(user) {
        await axios.post('/auth/register', user);
        return (await axios.post('/auth/login', user)).data.data.token;
    }
}
