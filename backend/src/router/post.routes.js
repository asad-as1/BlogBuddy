const express = require('express');
const router = express.Router();
const postController = require('../controllers/post.controller');
const { authenticate } = require('../middlewares/auth'); 

// router.post('/newPost', postController.createPost);  // while testing authenticate is not required
router.post('/newPost', authenticate, postController.createPost);
router.get('/allPosts', postController.getAllPosts);
router.get('/:postId', postController.getPostById);
router.put('/:postId', authenticate, postController.updatePost);
router.delete('/:postId', authenticate, postController.deletePost);
router.post('/:postId/like', authenticate, postController.likePost);
router.post('/:postId/unlike', authenticate, postController.unlikePost);
router.post('/:postId/comments', authenticate, postController.addComment);
router.delete('/:postId/comments/:commentId', authenticate, postController.deleteComment);

module.exports = router;