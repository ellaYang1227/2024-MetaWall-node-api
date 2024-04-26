const Post = require('../models/post');
const User = require('../models/user');
const successHandle = require('../services/successHandle');
const errorHandle = require('../services/errorHandle');

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
        try {
            const { user, image, content } = req.body;
            const addPost = await Post.create({ user, image, content: content.trim() });
            successHandle(res, addPost);
        } catch ({ errors }) {
            errorHandle(res, 400, 'format', errors);
        }
    },
    async deletePosts (req, res, next) {
        if (req.originalUrl === '/posts') {
            await Post.deleteMany({});
            const posts = await Post.find();
            successHandle(res, posts);
        } else {
            errorHandle(res, 400, 'routing');
        }
    },
    async deletePost (req, res, next) {
        try {
            const { id } = req.params;
            const delPost = await Post.findByIdAndDelete(id);
            if (delPost) {
                successHandle(res, delPost)
            } else {
                errorHandle(res, 400, 'id');
            }
        } catch ({ errors }) {
            errorHandle(res, 400, 'id', errors);
        }
    },
    async editPost (req, res, next) {
        try {
            const { body, params } = req;

            if (!Object.keys(body).length) {
                throw new Error();
            } else {
                // 檢查是否有多餘欄位
                const fields = ['image', 'content'];
                const excessFields = Object.keys(body).reduce((accumulator, currentValue) => {
                    if (!fields.includes(currentValue)) { accumulator.push(currentValue) }
                    return accumulator;
                }, []);

                if (excessFields.length) {
                   return errorHandle(res, 400, 'format', `不應包含 ${ excessFields.join('、') } 欄位`);
                }
                
                const { image, content } = body;
                const updateData = { image, content: content?.trim() };
                const { id } = params;
                // new 參數指定是否返回更新後的文件
                // runValidators 參數指定是否在更新時 進行 Schema 定義的驗證器
                const updatePost = await Post.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
        
                if (updatePost) {
                    successHandle(res, updatePost);
                } else {
                    errorHandle(res, 400, 'id');
                }
            }
        } catch ({ errors }) {
            errorHandle(res, 400, 'format', errors);
        }
    }

};

module.exports = posts;