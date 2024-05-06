const mongoose = require('mongoose');

const Post = require('../models/post');
const User = require('../models/user');
const Comment = require('../models/comment');
const appError = require('../services/appError');

const checkObjectId = {
    format(_id, next) {
        if (!mongoose.isObjectIdOrHexString(_id)) {
            return next(appError(400, 'objectIdFormat', next));
        }
    },
    async findById(modelName, _id, next) {
        let find;
        if (modelName === 'Post') {
            find = await Post.findById(_id);
        } else if (modelName === 'User') {
            find = await User.findById(_id);
        } else if (modelName === 'Comment') {
            find = await Comment.findById(_id);
        }

        if (find) {
            return find;
        } else {
            return next(appError(400, modelName === 'User' ? 'memberNotExist' : 'id', next));
        }
    }
};

module.exports = checkObjectId;