const Joi = require('joi');

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
