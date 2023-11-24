const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports.register = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string()
            .regex(/^[a-zA-Z0-9_\-]+$/)
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .min(8)
            .required(),
        repeat_password: Joi.string().required().valid(Joi.ref('password'))
    })

    const { error, value } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            status: 400,
            error: {
                message: error?.message
            }
        });
    }

    next();
}

module.exports.login = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string()
            .regex(/^[a-zA-Z0-9_\-]+$/)
            .min(3)
            .max(30)
            .required(),
        password: Joi.string()
            .required()
    });

    const { error, value } = schema.validate(res.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            error: {
                message: error.message
            }
        });
    }

    next();
}

module.exports.getUser = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.objectId().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            error: {
                message: error.message
            }
        })
    }
}

module.exports.getUsers = (req, res, next) => {
    const schema = Joi.object({
        limit: Joi.number().integer().min(1).max(10),
        skip: Joi.number().integer(),
        lastId: Joi.objectId()
    }).xor('skip', 'lastId');

    const { error, value } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            error: {
                message: error.message
            }
        })
    }

    next();
}