const path = require('path');

const express = require('express');

const messageController = require('../controllers/message');

const router = express.Router();

router.post('/game/:gameId/chat', messageController.postMessage);
router.get('/game/:gameId/chat', messageController.getMessages);

module.exports = router;
