const jwt = require('jsonwebtoken');
const { secret } = require('../lib/config');

module.exports = (throwError=false) => {

    return async (req, res, next) => {
        const unauthorized = () => {
            // если нужно отправлять ошибку
            if (throwError) return res.status(401).json({
                status: 401,
                error: {
                    message: 'Unauthorized'
                }
            });

            // в другом случае задаем пользователя undefinded
            next()
        }

        // если нет токена авторизации
        if (!req.get('Authorization')) return unauthorized();

        try {
            // получаем данные пользователя
            const payload = jwt.verify(req.get('Authorization').split('Bearer ')[1], secret.access);

            req.user = payload;
            next()

        } catch (err) {
            unauthorized();
        }
    }

}