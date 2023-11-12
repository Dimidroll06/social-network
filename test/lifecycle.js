const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const config = require('../lib/config');

const mongod = new MongoMemoryServer();

before(async () => {
    if (mongod.state !== 'running') {
        await mongod.start();
    }

    config.mongoConnection = mongod.getUri();
    await app(() => { console.log('Server is running') });
});

after(async () => {
    await mongod.stop();
})