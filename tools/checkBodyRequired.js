const appError = require('../services/appError');
const { errorMag } = require('../services/errorHandle');

const checkBodyRequired = (requireds, method, body, next) => {
    let count = 0;
    let errors = [];
    requireds.forEach(item => {
        // POST - 不能沒有傳 requireds 欄位名稱
        // PATCH - 只要有傳 requireds 欄位名稱一個即可
        if (method === 'POST' && body[item] === undefined) {
            errors.push(`${item} ${errorMag.requireds}`);
        } else if (method === 'PATCH') {
            if (!Object.keys(body).length) {
                errors.push(errorMag.emptyObject);
            } else if (typeof body[item] === 'string' && body[item].trim() === '') {
                errors.push(`${item} ${errorMag.data}`);
            } else {
                count += 1;
            }
        } else if (typeof body[item] === 'string' && body[item].trim() === '') {
            errors.push(`${item} ${errorMag.data}`);
        } else if (Array.isArray(body[item]) && !body[item].length) {
            errors.push(`${item} ${errorMag.requireds}`);
        } else {
            count += 1;
        }
    });

    if (count === requireds.length) {
        return true;
    } else {
        // 移除重複錯誤訊息
        errors = Array.from(new Set(errors));
        console.error(errors);
        return next(appError(400, errors, next));
    }
};

module.exports = checkBodyRequired;