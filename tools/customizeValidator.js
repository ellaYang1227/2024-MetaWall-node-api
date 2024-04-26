const validator = require('validator');

const appError = require('../services/appError');
const { errorMag } = require('../services/errorHandle');

const customizeValidator = {
    email (email, next) {
        // 是否為 email 格式
        if (!validator.isEmail(email)) {
            return next(appError(400, `email ${errorMag.validation}`, next));
        }
    },
    password (password, next) {
        // 密碼長度至少 8 碼，且英數混合
        if (!validator.isLength(password, { min: 8 }) ||
            !validator.matches(password, /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$/)
        ) {
            return next(appError(400, 'password', next));
        }
    },
    name (name, next) {
        if (typeof name !== 'string') {
            return next(appError(400, `name ${errorMag.validation}`, next));
        }

        // 名字長度至少 2 字元
        if (!validator.isLength(name, { min: 2 })) {
            return next(appError(400, 'nameMinLength', next));
        }
    },
    url (value, next, field) {
        if (typeof value !== 'string') {
            return next(appError(400, `${field} ${errorMag.validation}`, next));
        }

        // 須為 https 網址
        if (!validator.isURL(value, { protocols: ['https']})) {
            return next(appError(400, `${field} ${errorMag.url}`, next));
        }
    },
    sex (sex, next) {
        if (sex !== 'male' && sex !== 'female') {
            return next(appError(400, 'sex', next));
        }
    },
};

module.exports = customizeValidator;