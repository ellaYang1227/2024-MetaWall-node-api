const Post = require('../models/post');
const User = require('../models/user');
const successHandle = require('../services/successHandle');
const appError = require('../services/appError');
const checkBodyRequired = require('../tools/checkBodyRequired');
const customizeValidator = require('../tools/customizeValidator');

const requireds = ['content'];
const posts = {
    async getPosts (req, res, next) {
        const { query } = req;
        // asc 遞增(由小到大，由舊到新) "createdAt"
        // desc 遞減(由大到小、由新到舊) "-createdAt"
        const timeSort = query.timeSort === "asc" ? "createdAt":"-createdAt"
        const q = query.q !== undefined ? { "content": new RegExp(query.q) } : {};
        const posts = await Post.find(q)
            .populate({
                path: 'user', // postSchema 的欄位名稱
                select: 'name photo' // 要取得的資料欄位
            })
            .sort(timeSort);
        successHandle(res, posts);
    },
    async createPosts (req, res, next) {
        const { method, body, user } = req;
        const bodyResultIsPass = checkBodyRequired(
            requireds,
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { image, content } = body;
            const isValid = !image || image && customizeValidator.url(image, next, 'image');;
            if (!isValid) { return }

            const findUser = await User.findById(user.id);
            if (findUser) {
                const addPost = await Post.create({ user: user.id, image, content });
                successHandle(res, addPost);
            } else {
                return next(appError(400, 'memberNotExist', next));
            }
        }
    },
    async deletePosts (req, res, next) {
        if (req.originalUrl === '/posts') {
            await Post.deleteMany({ user: req.user.id });
            const posts = await Post.find();
            successHandle(res, posts);
        } else {
            return next(appError(400, 'routing', next));
        }
    },
    async deletePost (req, res, next) {
        const { params, user } = req;
        const delPost = await Post.findOneAndDelete({ _id: params.id , user: user.id });

        if (delPost) {
            successHandle(res, delPost)
        } else {
            return next(appError(400, 'idOrNotBelong', next));
        }
    },
    async editPost (req, res, next) {
        const { method, body, user, params } = req;
        const bodyResultIsPass = checkBodyRequired(
            requireds,
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { image, content } = body;
            const isValid = !image || image && customizeValidator.url(image, next, 'image');;
            if (!isValid) { return }

            const updateData = { image, content };
            // new 參數指定是否返回更新後的文件
            // runValidators 參數指定是否在更新時 進行 Schema 定義的驗證器
            const updatePost = await Post.findOneAndUpdate(
                { _id: params.id, user: user.id }, 
                updateData, 
                { new: true, runValidators: true });
        
            if (updatePost) {
                successHandle(res, updatePost);
            } else {
                return next(appError(400, 'idOrNotBelong', next));
            }
        }
    }

};

module.exports = posts;