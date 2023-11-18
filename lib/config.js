module.exports = {
    port: 8080,
    mongoConnection: 'mongodb://127.0.0.1:27017/?readPreference=primary&ssl=false&directConnection=true',
    secret: {
        refresh: 'kittycat1',
        access: 'kittycat2'
    },
    expire: {
        cookie: 30*24*60*60*1000,
        refresh_token: 30*24*60*60*1000,
        access_token: 15*60*1000
    }
}