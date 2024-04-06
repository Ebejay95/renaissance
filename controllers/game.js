const { authRedirect } = require('./auth');
const Game = require('../models/game');
const Biom = require('../models/biom');
const BiomController = require('../controllers/biom');
const Region = require('./region');
const RegionController = require('../controllers/region');

function formatGermanDate(date) {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return `${day}.${month}.${year}`;
}
function prepare_game_view(games) {
    const formatGame = (game) => {
        // Convert Mongoose document to a plain JavaScript object
        let gameObj = game.toObject();
        gameObj.last_action_at = formatGermanDate(gameObj.last_action_at);
        gameObj.created_at = formatGermanDate(gameObj.created_at);
        return gameObj;
    };

    if (Array.isArray(games)) {
        return games.map(game => formatGame(game));
    } else {
        return formatGame(games);
    }
}

exports.getIndex = (req, res, next) => {
	Game.find()
	  .then(games => {
		games = prepare_game_view(games)
		return res.render('game/index', {
			path: '/',
			games: games,
			pageTitle: 'Renaissance',
			user: req.session.user
		});
	})
	.catch(err => {
		console.log(err);
	});
};

exports.getNewGameRoom = (req, res, next) => {
	authRedirect(req, res, next);
	res.render('game/new-game', {
	  path: '/',
	  pageTitle: 'Neues Spiel',
	  user: req.session.user
	});
};

exports.getGame = async (req, res, next) => {
    authRedirect(req, res, next);

    const game = await Game.findById(req.params.gameId);
    const regions = await RegionController.getRegions(game._id);
    res.render('game/game', {
        path: '/',
        pageTitle: game.name,
        user: req.session.user,
        game: game,
		regions: regions
    });
};

exports.postGame = async (req, res, next) => {
    const name = req.body.name;
    const game = new Game({
        name: name,
        state: 'new',
        created_at: new Date(),
        last_action_at: new Date(),
        users: [],
        data: []
    });

    try {
        const savedGame = await game.save();

		await BiomController.createBioms(savedGame._id);
		await Region.createRegions(savedGame._id);
        req.flash('success', 'Spiel erfolgreich erstellt.');
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Ein Fehler ist beim Erstellen des Spiels aufgetreten.');
        res.redirect('/new-game');
    }
};

exports.restartGame = async (req, res, next) => {
    const game = await Game.findById(req.params.gameId);
    try {
        const savedGame = await game.save();
		await BiomController.deleteBioms(game._id);
		await Region.deleteRegions(game._id);
		await BiomController.createBioms(game._id);
		await Region.createRegions(game._id);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('error', 'Ein Fehler ist beim Erstellen des Spiels aufgetreten.');
        res.redirect('/new-game');
    }
};