const express = require('express');
const router = express.Router();
const { getUserProfile, followUser, searchUsers, getNotifications, updateProfile, getSuggestedUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/search', authMiddleware, searchUsers);
router.get('/notifications', authMiddleware, getNotifications);
router.get('/suggested', authMiddleware, getSuggestedUsers);
router.put('/profile', authMiddleware, updateProfile);
router.get('/:username', authMiddleware, getUserProfile);
router.post('/:targetUserId/follow', authMiddleware, followUser);

module.exports = router;
