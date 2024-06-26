# [六角]2024 Node.js 企業專題班 - 每週作業(week3~week8)

### [week3] 從 express MVC 架構建立 貼文 RESTful API(連接資料庫 mongodb)

使用 [Express 應用程式產生器(express-generator)](https://expressjs.com/zh-tw/starter/generator.html)，快速建立應用程式架構。

- 分支：[week3](https://github.com/ellaYang1227/2024-MetaWall-node-api/tree/week3)
- [[API URL]https://MetaWall-node-api-week3.onrender.com/](https://MetaWall-node-api-week3.onrender.com/)

### [week4] 期中考：打造全端 (FULL STACK) 網站架構 - 貼文 RESTful API(連接資料庫 mongodb)

使用引用(references)作法，將 post(貼文) collection 與 user(使用者) collection 建立關聯

- 分支：[week4](https://github.com/ellaYang1227/2024-MetaWall-node-api/tree/week4)
- [[API URL]https://MetaWall-node-api-week4.onrender.com/](https://MetaWall-node-api-week4.onrender.com/)

### [week5] Express middleware 異常狀態處理(連接資料庫 mongodb)

使用 [Express middleware 中介軟體](https://expressjs.com/zh-tw/guide/using-middleware.html)，統一處理錯誤或異常狀態處理。並透過 [cross-env 套件](https://www.npmjs.com/package/cross-env)針對 development 與 production 環境設定不同的錯誤訊息。

- 分支：[week5](https://github.com/ellaYang1227/2024-MetaWall-node-api/tree/week5)
- [[API URL]https://MetaWall-node-api-week5.onrender.com/](https://MetaWall-node-api-week5.onrender.com/)

### [week6] JWT 身份驗證機制(連接資料庫 mongodb)

使用 [jsonwebtoken 套件](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback) 新增 JWT 身份驗證、使用 [validator 套件](https://www.npmjs.com/package/validator) 新增自訂欄位驗證器功能、使用 [bcryptjs 套件](https://www.npmjs.com/package/bcryptjs) 新增密碼加解密處理功能。

- 分支：[week6](https://github.com/ellaYang1227/2024-MetaWall-node-api/tree/week6)
- [[API URL]https://MetaWall-node-api-week6.onrender.com/](https://MetaWall-node-api-week6.onrender.com/)

### [week7] Firebase 檔案與空間上傳(連接資料庫 mongodb)

使用 [multer 套件](https://www.npmjs.com/package/multer)、[image-size 套件](https://www.npmjs.com/package/image-size) 處理文件上傳、使用 [uuid 套件](https://www.npmjs.com/package/uuid) 為上傳檔案重新命名、使用 [firebase-admin 套件](https://www.npmjs.com/package/firebase-admin) 來存取並管理 Firebase 服務，並將圖片上傳到 Firebase 空間。

- 分支：[week7](https://github.com/ellaYang1227/2024-MetaWall-node-api/tree/week7)
- [[API URL]https://MetaWall-node-api-week7.onrender.com/](https://MetaWall-node-api-week7.onrender.com/)

### [week8] 新增按讚、追蹤、留言功能 API(連接資料庫 mongodb)

貼文 API 新增按讚(like)、追蹤(follow)、留言(comment)功能，並新增會員按讚追蹤動態相關 API。

- 分支：[week8](https://github.com/ellaYang1227/2024-MetaWall-node-api/tree/week8)
- [[API URL]https://MetaWall-node-api-week8.onrender.com/](https://MetaWall-node-api-week8.onrender.com/)

---

## 安裝 express

```
npm install express-generator -g
```

## 建立 express MVC 架構

```
express --no-view 2024-MetaWall-node-api
```

## 安裝

以下將會引導你如何安裝此專案到你的電腦上。

- Node.js v20.9.0

### 取得專案

```
git clone git@github.com:ellaYang1227/2024-MetaWall-node-api.git
```

### 移動到專案內

```
cd 2024-MetaWall-node-api
```

### 安裝套件

```
npm install
```

### 運行專案

```
npm run start
```

### 使用 nodemon 啟動伺服器

需先安裝 nodemon 套件

```
nodemon bin/www
```

### 瀏覽器開啟專案

```
http://127.0.0.1:3000/
```

### 專案相關設定檔

需新增 config.env 檔案，其相關參數(同 config.env_example)如下

```
DATABASE_PASSWORD=
DATABASE=
// week6 新增
JWT_SECRET=
JWT_EXPIRES_IN=
// week7 新增
FIREBASE_TYPE=
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
FIREBASE_CLIENT_ID=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
```

## 專案技術

- Node.js v20.9.0
- mongoose v8.2.0
- dotenv v16.4.5
- express v4.16.1
- cors v2.8.5
- cross-env v7.0.3
- jsonwebtoken v9.0.2
- validator v13.11.0
- bcryptjs v2.4.3
- firebase-admin v12.1.0
- image-size v1.1.1
- multer v1.4.5-lts.1
- uuid v9.0.1
- Render 部署 API
- Postman API 測試工具
