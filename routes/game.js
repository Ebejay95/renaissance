const path = require('path');

const express = require('express');

const gameController = require('../controllers/game');

const router = express.Router();

router.get('/', gameController.getIndex);

router.get('/new-game', gameController.getNewGameRoom);
router.post('/new-game', gameController.postGame);

router.get('/game/:gameId', gameController.getGame);
router.post('/game/delete/:gameId', gameController.deleteGame);

module.exports = router;
