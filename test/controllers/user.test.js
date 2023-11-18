const { axios, testUser, auth } = require('../helpers'); 
const User = require('../../models/User');

describe('User', () => {
    let userId, token;

    before(async () => {
        token = await auth(testUser);
        axios.defaults.headers.common.Authorization = token;
        userId = await User.findOne({ username: testUser.username }).id;
    });

    describe('/api/user/:id', () => {
        
        it('get own profile', async () => {
            const res = await axios.get('/user/'+userId);

            res.status.should.be.eql(200);
            res.data.data.username.should.be.eql(testUser.username);
            res.data.data.isMe.should.be.eql(true);
        });
        
        it('get profile (without access_token)', async () => {
            delete axios.defaults.headers.common.Authorization;
            const res = await axios.get('/user/'+userId);

            res.status.should.be.eql(200);
            res.data.data.username.should.be.eql(testUser.username);
            res.data.data.isMe.should.be.eql(false);

            axios.defaults.headers.common.Authorization = token;
        });

        it('get undefined profile', async () => {
            const res = await axios.get('/user/undefined');

            res.status.should.be.eql(404);
            res.data.error.message.should.be.eql('User is undefined');
        });
    });

    after(async () => {
        await User.find({}).deleteMany();
        delete axios.defaults.headers.common.Authorization;
    });
});