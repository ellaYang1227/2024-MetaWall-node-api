const mongoose = require('mongoose');

// - user：使用者 id(必填)
// - image：貼文圖片
// - content：貼文內容(必填)
// - likes：按讚數
// - comments：留言數
// - createdAt：發文時間
const postSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User", // 填寫 model name
            required: [true, 'user ID 必填']
        },
        image: {
            type: String,
            default: '',
            cast: false
        },
        content: {
            type: String,
            required: [true, '貼文內容必填'],
            cast: false
        },
        likes: [{
            type: mongoose.Schema.ObjectId,
            ref: "User", // 填寫 model name
        }],
        createdAt: {
            type: Date,
            default: Date.now,
            select: false
        }
    }, {
        versionKey: false, // 移除欄位 __v
        toJSON: { virtuals: true }, // 使用 postSchema.virtual 需要設定
        toObject: { virtuals: true } // 使用 postSchema.virtual 需要設定
    }
);

// 使用到才引用
postSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'post',
  localField: '_id'
});

// mongoose 會自動將名稱開頭轉為小寫並強制在結尾加 s：如 Post => posts
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
