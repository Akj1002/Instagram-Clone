const express = require('express');
const router = express.Router();
const { createStory, getFeedStories } = require('../controllers/storyController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/feed', authMiddleware, getFeedStories);
router.post('/', authMiddleware, createStory);

module.exports = router;
