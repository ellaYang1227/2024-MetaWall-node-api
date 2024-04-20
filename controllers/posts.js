const Post = require('../models/post');
const successHandle = require('../services/successHandle');
const errorHandle = require('../services/errorHandle');

const posts = {
    async getPosts (req, res, next) {
        // 貼文時間：新到舊
        successHandle(res, await Post.find().sort({ createdAt: -1 }));
    },
    async createPosts (req, res, next) {
        try {
            const { name, image, content, type, tags } = req.body;
            const addPost = await Post.create({ name, image, content: content.trim(), type, tags });
            successHandle(res, addPost);
        } catch ({ errors }) {
            errorHandle(res, 400, 'format', errors);
        }
    },
    async deletePosts (req, res, next) {
        await Post.deleteMany({});
        const posts = await Post.find();
        successHandle(res, posts);
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
            const { body } = req;
            if (!Object.keys(body).length) {
                throw new Error();
            } else {
                // 檢查是否有多餘欄位
                const fields = ['name', 'image', 'content', 'type', 'tags'];
                const excessFields = Object.keys(body).reduce((accumulator, currentValue) => {
                    if (!fields.includes(currentValue)) { accumulator.push(currentValue) }
                    return accumulator;
                }, []);

                if (excessFields.length) {
                   return errorHandle(res, 400, 'format', `不應包含 ${ excessFields.join('、') } 欄位`);
                }

                const { name, image, content, type, tags } = body;
                const updateData = { name, image, content: content?.trim(), type, tags };
                const { id } = req.params;
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