const { axios } = require('../helpers');
const User = require('../../models/User');

describe('Auth', () =>{ 
    const testUser = {
        username: 'Potato_228',
        password: 'strongpassword',
        repeat_password: 'strongpassword'
    };
    
    describe('/api/auth/register', () => {
        afterEach(async () => {
            await User.find({}).deleteMany();
        });

        it('Register user', async () => {
            const res = await axios.post('/auth/register', testUser);
            res.status.should.be.eql(201);

            const user = await User.findOne({ username: testUser.username });
            user.username.should.be.eql(testUser.username);
            user.password.should.be.a.String();
        });

        it('Register user with wrong retype', async () => {
            const res = await axios.post('/auth/register', {
               ...testUser,
                repeat_password: 'wrongrepeatpassword'
            });
            res.status.should.be.eql(400);
            res.data.error.message.should.be.a.String();
        });

        it('Register one user twice', async () => {
            await axios.post('/auth/register', testUser);
            const res = await axios.post('/auth/register', testUser);

            res.status.should.be.eql(400);
            res.data.error.message.should.be.eql('Username already exists');
        });
    })

    describe('/api/auth/login', () => {
        before(async () => {
            await axios.post('/auth/register', testUser);
        });

        after(async () => {
            await User.find({}).deleteMany();
        })

        it('Login user', async () => {
            const res = await axios.post('/auth/login', testUser);
            
            res.status.should.be.eql(200);
            res.data.data.token.should.be.startWith('Bearer ');
        });

        it('Login undefinded user', async () => {
            const res = await axios.post('/auth/login', {
                username: 'Potato',
                password: testUser.password
            });

            res.status.should.be.eql(400);
            res.data.error.message.should.be.eql('User does not exist');
        });

        it('Login with wrong pwd', async () => {
            const res = await axios.post('/auth/login', {
                username: testUser.username,
                password: 'passwordwrong'
            });

            res.status.should.be.eql(400);
            res.data.error.message.should.be.eql('Wrong password');
        });
    })
})