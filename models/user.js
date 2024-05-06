const mongoose = require('mongoose');

const { errorMag } = require('../services/errorHandle');

const userSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, `暱稱 ${errorMag.requireds}`],
      minlength: [2, errorMag.nameMinLength]
    },
    email: {
      type: String,
      required: [true, `email ${errorMag.requireds}`],
      unique: true,
      lowercase: true,
      select: false
    },
    password: {
      type: String,
      required: [true, `密碼 ${errorMag.requireds}`],
      minLength: [8, errorMag.password],
      select: false,
      cast: false,
    },
    photo: {
      type: String,
      default: ''
    },
    sex: {
      type: String,
      enum: ['male', 'female']
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false
    },
    followers: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    following: [
      {
        user: {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        },
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  }, {
    versionKey: false // 移除欄位 __v
});

const User = mongoose.model('User', userSchema);

module.exports = User;
