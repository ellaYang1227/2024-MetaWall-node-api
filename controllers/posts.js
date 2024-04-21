const Post = require('../models/post');
const User = require('../models/user');
const successHandle = require('../services/successHandle');
const appError = require('../services/appError');
const checkBodyRequired = require('../tools/checkBodyRequired');

const requireds = ['content'];
const posts = {
    async getPosts (req, res, next) {
        const { query } = req;
        // asc 遞增(由小到大，由舊到新) "createdAt"
        // desc 遞減(由大到小、由新到舊) "-createdAt"
        const timeSort = query.timeSort == "asc" ? "createdAt":"-createdAt"
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
        const { method, body } = req;
        const bodyResultIsPass = checkBodyRequired(
            ['user', ...requireds],
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { user, image, content } = body;
            const findUser = await User.findById(user);
            if (findUser) {
                const addPost = await Post.create({ user, image, content: content.trim() });
                successHandle(res, addPost);
            } else {
                return next(appError(400, 'user', next));
            }
        }
    },
    async deletePosts (req, res, next) {
        await Post.deleteMany({});
        const posts = await Post.find();
        successHandle(res, posts);
    },
    async deletePost (req, res, next) {
        const { id } = req.params;
        const delPost = await Post.findByIdAndDelete(id);
        if (delPost) {
            successHandle(res, delPost)
        } else {
            return next(appError(400, 'id', next));
        }
    },
    async editPost (req, res, next) {
        const { method, body } = req;
        const bodyResultIsPass = checkBodyRequired(
            requireds,
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { image, content } = body;
            const updateData = { image, content: content.trim() };
            const { id } = req.params;
            // new 參數指定是否返回更新後的文件
            // runValidators 參數指定是否在更新時 進行 Schema 定義的驗證器
            const updatePost = await Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        
            if (updatePost) {
                successHandle(res, updatePost);
            } else {
                return next(appError(400, 'id', next));
            }
        }
    }

};

module.exports = posts;