const express = require('express');
const router = express.Router();
const { createPost, getFeed, getPostById, getUserPosts, getExplorePosts, toggleSavePost, getSavedPosts } = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, upload.single('image'), createPost);
router.get('/explore', authMiddleware, getExplorePosts);
router.get('/feed', authMiddleware, getFeed);
router.get('/saved', authMiddleware, getSavedPosts);
router.post('/:id/save', authMiddleware, toggleSavePost);
router.get('/:id', authMiddleware, getPostById);
router.get('/user/:userId', authMiddleware, getUserPosts);

module.exports = router;
