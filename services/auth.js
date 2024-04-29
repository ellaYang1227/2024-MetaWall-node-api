const jwt = require('jsonwebtoken');

const appError = require('../services/appError');
const { errorMag } = require('../services/errorHandle');
const handleErrorAsync = require('../services/handleErrorAsync');
const successHandle = require('../services/successHandle');
const User = require('../models/user');

const isAuth = handleErrorAsync(async (req, res, next) => {
    let { authorization } = req.headers;
    if (!authorization) { return next(appError(401, 'noAuthorization', next)) }
    if (!req.headers.authorization.startsWith('Bearer')) { return next(appError(401, `token ${errorMag.validation}`, next))}

    const token = authorization.split(' ').pop();
    const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if (err) {
                return next(appError(401, 'jwt', next));
            } else {
                resolve(payload);
            }
        });
    });

    req.user = await User.findById(decoded.id);
    next();
});

const generateSendJWT = ((res, user, next) => {
    const { _id, name, photo } = user; 
    const token = jwt.sign({ id: _id, name, photo }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
    successHandle(res, { token });
})

module.exports = {
    isAuth,
    generateSendJWT
};