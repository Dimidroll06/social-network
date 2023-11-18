const { CronJob } = require('cron');
const Token = require('../models/Token');
const jwt = require('jsonwebtoken');
const { secret } = require('./config');

module.exports = new CronJob(
    '* * * 1 * *', // каждый 1 день месяца
    async () => {

        console.log('[cron] Clearing expired tokens...');
        
        const tokens = await Token.find({}); // получаем все токены
        tokens.forEach(token => {
            try {
                jwt.verify(token.token, secret.refresh); // проверяем токен
            } catch (err) {
                console.log(`Deleting token ${token._id}`);
                Token.findByIdAndDelete(token._id); // если токен поломан - удаляем
            }
        });
        
        console.log('[cron] Expired tokens cleared succesfully');

    },
    null,
    false,
    'UTC+3'
);