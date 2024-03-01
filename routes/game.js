const path = require('path');

const express = require('express');

const gameController = require('../controllers/game');

const router = express.Router();

router.get('/', gameController.getIndex);

module.exports = router;
