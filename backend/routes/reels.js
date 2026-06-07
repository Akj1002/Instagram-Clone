const express = require('express');
const router = express.Router();
const { getReels, createReel } = require('../controllers/reelController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getReels);
router.post('/', authMiddleware, createReel);

module.exports = router;
