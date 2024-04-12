# [六角]2024 Node.js 企業專題班 - 每週作業(week3~week8)

### [week3] 從 express MVC 架構建立 貼文 RESTful API(連接資料庫 mongodb)

使用 [Express 應用程式產生器(express-generator)](https://expressjs.com/zh-tw/starter/generator.html)，快速建立應用程式架構。

- 分支：[week3](https://github.com/ellaYang1227/2024-MetaWall-node-api/tree/week3)
- [[API URL]https://MetaWall-node-api-week3.onrender.com/](https://MetaWall-node-api-week3.onrender.com/)

### [week4] 期中考：打造全端 (FULL STACK) 網站架構 - 貼文 RESTful API(連接資料庫 mongodb)

使用引用(references)作法，將 post(貼文) collection 與 user(使用者) collection 建立關聯

- 分支：[week4](https://github.com/ellaYang1227/2024-MetaWall-node-api/tree/week4)
- [[API URL]https://MetaWall-node-api-week4.onrender.com/](https://MetaWall-node-api-week4.onrender.com/)

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

需新增 config.env 檔案，其相關參數如下

```
DATABASE_PASSWORD=
DATABASE=
```

## 專案技術

- Node.js v20.9.0
- mongoose v8.2.0
- dotenv v16.4.5
- express v4.16.1
- cors v2.8.5
- Render 部署 API
- Postman API 測試工具
