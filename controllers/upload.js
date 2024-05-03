const { v4: uuidv4 } = require('uuid');
const firebaseAdmin = require('../services/firebase');
const bucket = firebaseAdmin.storage().bucket();

const successHandle = require('../services/successHandle');
const { errorHandle } = require('../services/errorHandle');
const customizeValidator = require('../tools/customizeValidator');

const upload = {
    async uploadImg (req, res, next) {
        // 圖片使用單元(貼文(post) 或 使用者(user))
        let { unit } = req.query;
        unit = unit ? unit : 'post';
        
        // 取得上傳的檔案資訊列表裡面的第一個檔案
        const uploadFilesIsValid = customizeValidator.uploadFiles(req.files.length, next);
        if (!uploadFilesIsValid) { return }

        // 取得上傳的檔案資訊列表裡面的第一個檔案
        const file = req.files[0];

        // 圖片用於 user
        if (unit === 'user') {
            const fileBuffer = file.buffer;
            const isValid = customizeValidator.imgEqualSize(fileBuffer, next) &&
            customizeValidator.imgWidthSize(fileBuffer, next);
            if (!isValid) { return }
        }

        // 基於檔案的原始名稱建立一個 blob 物件
        const blob = bucket.file(`images/${uuidv4()}.${file.originalname.split('.').pop()}`);
        // 建立一個可以寫入 blob 的物件
        const blobStream = blob.createWriteStream()

        // 監聽上傳狀態，當上傳完成時，會觸發 finish 事件
        blobStream.on('finish', () => {
            // 設定檔案的存取權限
            const config = {
                action: 'read', // 權限
                expires: '12-31-2500', // 網址的有效期限
            };
            // 取得檔案的網址
            blob.getSignedUrl(config, (err, fileUrl) => {
                console.log(fileUrl)
                successHandle(res, { fileUrl });
            });
        });

        // 如果上傳過程中發生錯誤，會觸發 error 事件
        blobStream.on('error', (err) => {
            errorHandle(res, 500, 'uploadFilesFail');
        });

        // 將檔案的 buffer 寫入 blobStream
        blobStream.end(file.buffer);
    }
};

module.exports = upload;