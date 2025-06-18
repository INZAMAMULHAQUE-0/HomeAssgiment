const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const { sendMessage, getChatHistory } = require('../controllers/chatController');

router.post('/send', auth, sendMessage);
router.get('/history', auth, getChatHistory);

module.exports = router;
