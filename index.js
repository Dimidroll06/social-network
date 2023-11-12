const start = require('./app');
const config = require('./lib/config');

const app = start(() => console.log(`Server listening on http://localhost:${config.port}`));