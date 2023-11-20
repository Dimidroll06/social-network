const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secret, expire } = require('../lib/config');
const multer  = require('multer');
const path = require('path');
const { uuid } = require('uuidv4');
const Jimp = require('jimp');
const fs = require('fs');
const Token = require('../models/Token');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },

    filename: (req, file, cb) => {
        const name = uuid() + '.' + file.mimetype.split('/')[1];

        cb(null, name);
    }
});

const upload = multer({
    storage,
    
    fileFilter: (req, file, cb) => {
        const filetypes = /jpg|jpeg|png|gif/;

        if ( filetypes.test(path.extname(file.originalname).toLocaleLowerCase()) && filetypes.test(file.mimetype) ) {
            return cb(null, true);
        } 
        cb(new Error('Only images allowed'));
    },

    limits: {
        fileSize: 1024*1024
    }

}).single('photo');

const deleteProfilePicture = ({ photo }) => {
    fs.unlink('./public/images/' + photo, (err) => {
        if (err) {
            console.err(err);
            return
        }
    });

    fs.unlink('./public/images/100x100/' + photo, (err) => {
        if (err) {
            console.err(err);
            return
        }
    });
}

module.exports.upload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                status: 400,
                error: {
                    message: err.message
                }
            });
        }

        if (!req.file) {
            return res.status(400).json({
                status: 400,
                error: {
                    message: 'Please upload a file'
                }
            });
        }

        req.body.photo = req.file.filename;

        Jimp.read(req.file.path, (err, test) => {
            if (err) throw err

            test
                .resize(100, 100)
                .quality(50)
                .write('./public/images/100x100/'+req.body.photo);
            next();
        });
    });
}

module.exports.setProfilePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('profilePicture');
        if (user.profilePicture !== 'default.png') {
            deleteProfilePicture({ photo: user.profilePicture });
        }

        user.profilePicture = req.body.photo;
        await user.save();

        res.status(200).json({
            status: 200,
            data: {}
        });

    } catch (err) {
        res.status(500).json({
            status: 500,
            error: {
                message: 'Something went wrong'
            }
        });

        console.err(err);
    }
}

module.exports.register = async (req, res) => {
    const { username, password } = req.body;

    // проверка на существование пользователя
    const user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({
            status: 400,
            error: {
                message: 'Username already exists'
            }
        });
    }

    // генерация хеша пароля
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    await new User({ username, password: hash }).save();

    res.status(201).send({
        status: 201,
        data: {}
    });
}

module.exports.login = async (req, res) => {
    const { username, password } = req.body;

    // проверка на существование пользователя
    const user = await User.findOne({ username });

    if(!user) {
        return res.status(400).json({
            status: 400,
            error: {
                message: 'User does not exist'
            }
        });
    }

    // проверка на валидность пароля
    if ( !(await bcrypt.compare(password, user.password)) ) {
        return res.status(400).json({
            status: 400,
            error: {
                message: 'Wrong password'
            }
        });
    }

    // генерация refresh токена
    const refresh_token = jwt.sign({ id: user._id }, secret.refresh, { expiresIn: expire.refresh_token });
    res.cookie('refresh_token', refresh_token, { maxAge: expire.cookie, httpOnly: true });
    
    await Token.create({
        user: user._id,
        token: refresh_token
    }).catch((err) => console.error(err));
    
    // генерация access токена
    const access_token = jwt.sign({ id: user._id }, secret.access, { expiresIn: expire.access_token });

    res.status(200).json({
        status: 200,
        data: {
            token: `Bearer ${access_token}`
        }
    });
}

module.exports.regenerateTokens = async (req, res) => {
    // получаем старый токен
    const old_refresh_token = req.cookies['refresh_token'];

    // т.к. куки удаляются, если куков нет, значит токен 
    // либо испарился, либо запрос был сделан без логина 
    if (!old_refresh_token) return res.status(401).json({
        status: 500,
        data: {
            message: 'Please authentificate again'
        },
        error: {
            message: err.message == 'jwt expired'? 
                'Refresh token expired':
                'Something went wrong'
        }
    })

    // проверяем валидность токена
    try {
        const payload = jwt.verify(old_refresh_token, secret.refresh);

        // проверяем валидность данных
        const user = await User.findOne(payload.id)

        // создаём новую пару токенов
        const refresh_token = jwt.sign({ id: user._id }, secret.refresh, { expiresIn: expire.refresh_token });
        const access_token = jwt.sign({ id: user._id }, secret.access, { expiresIn: expire.access_token });

        // меняем токен
        const token = await Token.findOne({
            token: old_refresh_token
        });

        token.token = refresh_token;
        await token.save();
        
        // меняем куки
        req.cookie('refresh_token', refresh_token, { maxAge: expire.cookie, httpOnly: true });

        // отправляем access токен
        res.status(200).json({
            status: 200,
            data: {
                token: `Bearer ${access_token}`
            }
        });

    } catch (err) {
        // код 500, потому что куки должны были автоматом испариться вместе с токеном,
        // поэтому ошибки 'jwt expired' быть не должно
        res.status(500).json({
            status: 500,
            data: {
                message: 'Please authentificate again'
            },
            error: {
                message: err.message == 'jwt expired'? 
                    'Refresh token expired':
                    'Something went wrong'
            }
        })
    }
}

module.exports.logout = async (req, res) => {
    // получаем старый рефреш токен
    const old_refresh_token = req.cookies['refresh_token'];

    // предохроняемся от ошибок, если токена нет/сессия закончилась
    if (!old_refresh_token) return res.status(200).json({
        status: 200,
        data: {
            message: 'Logout successfully'
        }
    });

    // удаляем токен
    await Token.findOneAndDelete({ token: old_refresh_token });

    res.status(200).json({
        status: 200,
        data: {
            message: 'Logout successfully'
        }
    });
}

module.exports.getUser = async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    
    if (!user) return res.status(404).json({
        status: 404,
        error: {
            message: 'User is undefined'
        }
    });

    if (!req.user) return res.status(200).json({
        status: 200,
        data: {
            username: user.username,
            profilePicture: user.profilePicture,
            link: user.link,
            createdDate: user.createdDate,
            isMe: false
        }
    });

    res.status(200).json({
        status: 200,
        data: {
            username: user.username,
            profilePicture: user.profilePicture,
            link: user.link,
            createdDate: user.createdDate,
            isMe: req.user.id === user._id
        }
    })
}