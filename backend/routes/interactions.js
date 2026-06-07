const express = require('express');
const router = express.Router();
const { likePost, commentOnPost } = require('../controllers/interactionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:postId/like', authMiddleware, likePost);
router.post('/:postId/comment', authMiddleware, commentOnPost);

module.exports = router;
