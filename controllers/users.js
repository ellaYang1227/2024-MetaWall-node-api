const bcrypt = require('bcryptjs');

const User = require('../models/user');
const successHandle = require('../services/successHandle');
const appError = require('../services/appError');
const { generateSendJWT } = require('../services/auth');
const checkBodyRequired = require('../tools/checkBodyRequired');
const customizeValidator = require('../tools/customizeValidator');

const encrypt = (password) => bcrypt.hash(password, 12);

const users = {
    async signUp (req, res, next) {
        const { method, body } = req;
        const bodyResultIsPass = checkBodyRequired(
            ['email', 'password', 'name'],
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { email, password, name } = body;
            customizeValidator.email(email, next);
            customizeValidator.password(password, next);
            customizeValidator.name(name, next);

            const addUser = await User.create({ 
                email, 
                password: await encrypt(password), 
                name 
            });
            
            generateSendJWT(res, addUser);
        }
    },
    async signIn (req, res, next) {
        const { method, body } = req;
        const bodyResultIsPass = checkBodyRequired(
            ['email', 'password'],
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { email, password } = body;
            customizeValidator.email(email, next);

            const findUser = await User.findOne({ email }).select('+password');
            if (!findUser) { return next(appError(400, 'memberNotExist', next)) }

            // 比對 post 密碼與資料庫密碼是否一致
            const auth = await bcrypt.compare(password, findUser.password);
            if (!auth) { return next(appError(400, 'signIn', next)) }
            
            generateSendJWT(res, findUser);
        }
    },
    async updatePassword (req, res, next) {
        const { method, body, user } = req;
        const bodyResultIsPass = checkBodyRequired(
            ['newPassword', 'confirmPassword'],
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { newPassword, confirmPassword } = body;
            customizeValidator.password(newPassword, next);

            if (newPassword !== confirmPassword) { return next(appError(400, 'passwordUnequal', next)) }
            await User.findByIdAndUpdate(user._id, 
                { password: await encrypt(newPassword)}, 
                { new: true, runValidators: true });

            successHandle(res, "密碼更新成功");
        }
    },
    async getProfile (req, res, next) {
        const findUser = await User.findById(req.user._id);
        successHandle(res, findUser);
    },
    async editProfile (req, res, next) {
        const { method, body, user } = req;
        const bodyResultIsPass = checkBodyRequired(
            ['name', 'sex'],
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { photo, name, sex } = body;
            if (photo) { customizeValidator.url(photo, next, 'photo') }
            if (name) { customizeValidator.name(name, next) }
            if (sex) { customizeValidator.sex(sex, next) }

            const updatUser = await User.findByIdAndUpdate(user._id, 
                { photo, name, sex }, 
                { new: true, runValidators: true });

            if (updatUser) {
                successHandle(res, updatUser);
            } else {
                return next(appError(400, 'jwt', memberNotExist));
            }
        }
    }
};

module.exports = users;