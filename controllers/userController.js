const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { secret } = require('../lib/config');
const multer  = require('multer');
const path = require('path');
const { uuid } = require('uuidv4');
const Jimp = require('jimp');
const fs = require('fs');

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
    const user = await User.findOne({ username });
    if (user) {
        return res.status(400).json({
            status: 400,
            error: {
                message: 'Username already exists'
            }
        });
    }

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
    const user = await User.findOne({ username });
    
    if(!user) {
        return res.status(400).json({
            status: 400,
            error: {
                message: 'User does not exist'
            }
        });
    }

    if ( !(await bcrypt.compare(password, user.password)) ) {
        return res.status(400).json({
            status: 400,
            error: {
                message: 'Wrong password'
            }
        });
    }

    const payload = {
        id: user.id,
        username: user.username
    };

    const token = jwt.sign(payload, secret);
    
    res.status(200).json({
        status: 200,
        data: {
            token: `Bearer ${token}`
        }
    });
}