const express = require('express');
const router = express.Router();

const PostsControllers = require('../controllers/posts');
const handleErrorAsync = require('../services/handleErrorAsync');
const { isAuth } = require('../services/auth');

router.get('/', isAuth, PostsControllers.getPostsOrPost);
router.get('/:id', isAuth, PostsControllers.getPostsOrPost);
router.post('/', isAuth, handleErrorAsync(PostsControllers.createPosts));
router.post('/:id/like', isAuth, handleErrorAsync(PostsControllers.addPostLike));
router.delete('/:id/unlike', isAuth, handleErrorAsync(PostsControllers.removePostLike));
router.post('/:id/comment', isAuth, handleErrorAsync(PostsControllers.addPostComment));
router.get('/user/:userID', isAuth, PostsControllers.getMyPosts);
router.delete('/', isAuth, PostsControllers.deletePosts);
router.delete('/:id', isAuth, handleErrorAsync(PostsControllers.deletePost));
router.patch('/:id', isAuth, handleErrorAsync(PostsControllers.editPost));

module.exports = router;
