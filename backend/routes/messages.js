const express = require('express');
const router = express.Router();
const { getConversations, getMessages, sendMessage } = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/conversations', authMiddleware, getConversations);
router.get('/:otherUserId', authMiddleware, getMessages);
router.post('/:otherUserId', authMiddleware, sendMessage);

module.exports = router;
