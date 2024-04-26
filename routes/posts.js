const express = require('express');
const router = express.Router();

const PostsControllers = require('../controllers/posts');
const handleErrorAsync = require('../services/handleErrorAsync');
const { isAuth } = require('../services/auth');

router.get('/', isAuth, PostsControllers.getPosts);
router.post('/', isAuth, handleErrorAsync(PostsControllers.createPosts));
router.delete('/', isAuth, PostsControllers.deletePosts);
router.delete('/:id', isAuth, handleErrorAsync(PostsControllers.deletePost));
router.patch('/:id', isAuth, handleErrorAsync(PostsControllers.editPost));

module.exports = router;
