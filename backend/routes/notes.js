const express = require('express');
const router = express.Router();
const { createNote, getNotes } = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getNotes);
router.post('/', authMiddleware, createNote);

module.exports = router;
