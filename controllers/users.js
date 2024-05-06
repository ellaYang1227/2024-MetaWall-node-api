const bcrypt = require('bcryptjs');

const Post = require('../models/post');
const User = require('../models/user');
const successHandle = require('../services/successHandle');
const appError = require('../services/appError');
const { generateSendJWT } = require('../services/auth');
const checkBodyRequired = require('../tools/checkBodyRequired');
const customizeValidator = require('../tools/customizeValidator');
const checkObjectId = require('../tools/checkObjectId');

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
            const isValid = customizeValidator.email(email, next) && 
            customizeValidator.password(password, next) && customizeValidator.name(name, next);
            if (!isValid) { return }

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
            const isValid = customizeValidator.email(email, next);
            if (!isValid) { return }

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
            const isValid = customizeValidator.password(newPassword, next);
            if (!isValid) { return }
            
            if (newPassword !== confirmPassword) { return next(appError(400, 'passwordUnequal', next)) }
            await User.findByIdAndUpdate(user._id, 
                { password: await encrypt(newPassword)}, 
                { new: true, runValidators: true });

            successHandle(res, "密碼更新成功");
        }
    },
    async getProfile (req, res, next) {
        //const findUser = await User.findById(req.user._id);
        const findUser = await checkObjectId.findById('User', req.user.id, next);
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
            if (photo) { 
                const isValid = customizeValidator.url(photo, next, 'photo');
                if (!isValid) { return }
            }

            if (name) {
                const isValid = customizeValidator.name(name, next);
                if (!isValid) { return }
            }

            if (sex) {
                const isValid = customizeValidator.sex(sex, next);
                if (!isValid) { return }
            }

            const updatUser = await User.findByIdAndUpdate(user._id, 
                { photo, name, sex }, 
                { new: true, runValidators: true });

            if (updatUser) {
                successHandle(res, updatUser);
            } else {
                return next(appError(400, 'jwt', next));
            }
        }
    },
    async addFollow (req, res, next) {
        const { params, user } = req;
        checkObjectId.format(params.id, next);

         // 不能追蹤自己
        if (params.id === user.id) { return next(appError(400, 'followingOwn', next)) }
        const findUser = await checkObjectId.findById('User', params.id, next);

        if (findUser) {
            // 更新到追隨者
            await User.updateOne(
                {
                    _id: user.id,
                    'following.user': { $ne: params.id }
                },
                {
                    $addToSet: { following: { user: params.id } }
                }
            );

            // 更新到跟隨者
            await User.updateOne(
                {
                    _id: params.id,
                    'followers.user': { $ne: user.id }
                },
                {
                    $addToSet: { followers: { user: user.id } }
                }
            );

            const followers = await checkObjectId.findById('User', req.user.id, next);
            successHandle(res, followers);
        }
    },
    async unfollow(req, res, next) {
        const { params, user } = req;

        // 不能移除跟隨自己
        if (params.id === user.id) {
            return next(appError(400, 'unfollowingOwn', next));
        }

        checkObjectId.format(params.id, next);
        const findUser = await checkObjectId.findById('User', params.id, next);

        if (findUser) {
            // 更新到追隨者
            await User.updateOne(
                {
                    _id: user.id
                },
                {
                    $pull: { following: { user: params.id } }
                }
            );

            // 更新到跟隨者
            await User.updateOne(
                {
                    _id: params.id
                },
                {
                    $pull: { followers: { user: user.id } }
                }
            );

            const followers = await User.findById(params.id);
            successHandle(res, followers);
        }
    },
    async getLikeList(req, res, next) {
        const likeList = await Post.find({
            likes: { $in: [req.user.id] }
        })
            .sort('-createdAt')
            .populate({
                path: 'user',
                select: '_id name photo'
            });

        successHandle(res, likeList);
    },
    async myFollowing(req, res, next) {
        const findUser = await checkObjectId.findById('User', req.user.id, next);
        const followings = [];
        const { following } = findUser;
        const followingLen = following.length;
        if (!followingLen) { successHandle(res, followings) }

        await following.forEach(async (item, index) => {
            const user = await User.findById(item.user).select('name photo');
            if (!user) { return next(appError(400, 'memberNotExist', next)) }
            item.user = user;
            followings.push(item);

            if (followingLen - 1 === index) {
                successHandle(res, followings.reverse())
            }
        });
    }
};

module.exports = users;
