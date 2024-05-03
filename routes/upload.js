const express = require('express');
const router = express.Router();

const uploadControllers = require('../controllers/upload');
const upload = require('../services/uploadImage');
const { isAuth } = require('../services/auth');
const handleErrorAsync = require('../services/handleErrorAsync');

router.post('/', upload, isAuth, handleErrorAsync(uploadControllers.uploadImg));

module.exports = router;