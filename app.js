const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const errorHandle = require('./services/errorHandle');
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');

const app = express();

require('./connections');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/posts', postsRouter);

app.use((req, res, next) => {
  errorHandle(res, 404, 'routing');
});

module.exports = app;
