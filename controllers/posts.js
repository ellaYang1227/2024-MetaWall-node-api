const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const successHandle = require('../services/successHandle');
const appError = require('../services/appError');
const checkBodyRequired = require('../tools/checkBodyRequired');
const checkObjectId = require('../tools/checkObjectId');
const customizeValidator = require('../tools/customizeValidator');

const postRequireds = ['content'];
const userPopulate = {
    path: 'user', // postSchema 的欄位名稱
    select: 'name photo' // 要取得的資料欄位
};

const commentsPopulate = { 
    path: 'comments',  // postSchema 的 virtual 名稱
    select: 'comment user createdAt' 
};

// new 參數指定是否返回更新後的文件
// runValidators 參數指定是否在更新時 進行 Schema 定義的驗證器
const updateOptions = { new: true, runValidators: true };

const posts = {
    async getPostsOrPost (req, res, next) {
        const { query, params } = req;
        const _id = params.id;
        // asc 遞增(由小到大，由舊到新) "createdAt"
        // desc 遞減(由大到小、由新到舊) "-createdAt"
        const timeSort = query.timeSort === "asc" ? "createdAt":"-createdAt"
        const q = query.q !== undefined ? { "content": new RegExp(query.q) } : {};
        
        let data;
        if (_id) {
            checkObjectId.format(_id, next);
            const findPost = await checkObjectId.findById('Post', _id, next);

            if (findPost) {
                data = await Post.findOne({ ...q, _id})
                .populate(userPopulate)
                .populate(commentsPopulate);
            }
        } else {
            data = await Post.find(q)
            .populate(userPopulate)
            .populate(commentsPopulate)
            .sort(timeSort);
        }
        
        successHandle(res, data);
    },
    async createPosts (req, res, next) {
        const { method, body, user } = req;
        const bodyResultIsPass = checkBodyRequired(
            postRequireds,
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { image, content } = body;
            const isValid = !image || image && customizeValidator.url(image, next, 'image');;
            if (!isValid) { return }

            const findUser = await checkObjectId.findById('User', user.id, next);

            if (findUser) {
                const addPost = await Post.create({ user: user.id, image, content });
                successHandle(res, addPost);
            }
        }
    },
    async addPostLike (req, res, next) {
        const { params, user } = req;
        
        checkObjectId.format(params.id, next);
        const updatePost = await Post.findOneAndUpdate(
            { _id: params.id }, 
            { $addToSet: { likes: user.id } },
            updateOptions
        );

        if (updatePost) {
            successHandle(res, updatePost)
        } else {
            return next(appError(400, 'id', next));
        }
    },
    async removePostLike (req, res, next) {
        const { params, user } = req;
        
        checkObjectId.format(params.id, next);
        const updatePost = await Post.findOneAndUpdate(
            { _id: params.id }, 
            { $pull: { likes: user.id } },
            updateOptions
        );

        if (updatePost) {
            successHandle(res, updatePost)
        } else {
            return next(appError(400, 'id', next));
        }
    },
    async addPostComment (req, res, next) {
        const { method, body, user, params } = req;
        const bodyResultIsPass = checkBodyRequired(
            ['comment'],
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { comment } = body;
            checkObjectId.format(params.id, next);
            const findPost = await checkObjectId.findById('Post', params.id, next);

            if (findPost) {
                await Comment.create({
                    post: params.id,
                    user: user.id,
                    comment
                });

                const post = await Post.findById(params.id)
                    .populate(userPopulate)
                    .populate(commentsPopulate);

                successHandle(res, post);
            }
        }
    },
    async getMyPosts (req, res, next) {
        const { query, params } = req;
        const { userID } = params;
        // asc 遞增(由小到大，由舊到新) "createdAt"
        // desc 遞減(由大到小、由新到舊) "-createdAt"
        const timeSort = query.timeSort === "asc" ? "createdAt":"-createdAt"
        const q = query.q !== undefined ? { "content": new RegExp(query.q) } : {};
        
        checkObjectId.format(userID, next);
        const findUser = await checkObjectId.findById('User', userID, next);

        if (findUser) {
            const posts = await Post.find({ ...q, user: userID })
                .populate(userPopulate)
                .populate(commentsPopulate)
                .sort(timeSort);
        
            successHandle(res, posts);
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
        
        checkObjectId.format(params.id, next);
        const delPost = await Post.findOneAndDelete({ _id: params.id , user: user.id })
            .populate(userPopulate)
            .populate(commentsPopulate);

        if (delPost) {
            successHandle(res, delPost)
        } else {
            return next(appError(400, 'idOrNotBelong', next));
        }
    },
    async editPost (req, res, next) {
        const { method, body, user, params } = req;
        const bodyResultIsPass = checkBodyRequired(
            postRequireds,
            method,
            body,
            next
        );

        if (bodyResultIsPass) {
            const { image, content } = body;
            const isValid = !image || image && customizeValidator.url(image, next, 'image');
            if (!isValid) { return }

            const updateData = { image, content };
            
            checkObjectId.format(params.id, next);
            const updatePost = await Post.findOneAndUpdate(
                { _id: params.id, user: user.id }, 
                updateData, 
                updateOptions
            )
            .populate(userPopulate)
            .populate(commentsPopulate);
        
            if (updatePost) {
                successHandle(res, updatePost);
            } else {
                return next(appError(400, 'idOrNotBelong', next));
            }
        }
    }

};

module.exports = posts;