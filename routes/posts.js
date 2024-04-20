const express = require('express');
const router = express.Router();

const PostsControllers = require('../controllers/posts');
const handleErrorAsync = require('../services/handleErrorAsync');

router.get('/', PostsControllers.getPosts);
router.post('/', handleErrorAsync(PostsControllers.createPosts));
router.delete('/', PostsControllers.deletePosts);
router.delete('/:id', handleErrorAsync(PostsControllers.deletePost));
router.patch('/:id', handleErrorAsync(PostsControllers.editPost));

module.exports = router;
