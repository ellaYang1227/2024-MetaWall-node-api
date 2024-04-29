const express = require('express');
const router = express.Router();

const UsersControllers = require('../controllers/users');
const handleErrorAsync = require('../services/handleErrorAsync');
const { isAuth } = require('../services/auth');

router.post('/sign_up', handleErrorAsync(UsersControllers.signUp));
router.post('/sign_in', handleErrorAsync(UsersControllers.signIn));
router.post('/updatePassword', isAuth, handleErrorAsync(UsersControllers.updatePassword));
router.get('/profile', isAuth, UsersControllers.getProfile);
router.patch('/profile', isAuth, handleErrorAsync(UsersControllers.editProfile));

module.exports = router;