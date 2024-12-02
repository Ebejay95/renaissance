const { authRedirect } = require('./auth');
const User = require('../models/user');
const Game = require('../models/game');
const Message = require('../models/message');
const BiomController = require('../controllers/biom');
const Region = require('./region');
const RegionController = require('../controllers/region');
const MessageController = require('../controllers/message');
const MiseryController = require('../controllers/misery');
const CardController = require('../controllers/card');
const DiceController = require('../controllers/dice');
const ShipController = require('../controllers/ship');
const TroopController = require('../controllers/troop');
const ProgressController = require('../controllers/progress');

function formatGermanDate(date) {
    const d = new Date(date);
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    return`${day}.${month}.${year}`;
}
function prepare_game_view(games) {
    const formatGame = (game) => {
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
    let userId = null;
    if (req.session.user) {
		userId = req.session.user._id;
	}
    Game.find({ users: userId })
        .then(games => {
            games = prepare_game_view(games);
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

exports.getNewGameRoom = async (req, res, next) => {
    try {
        await authRedirect(req, res, next);
        const user = await User.findById(req.session.user._id).populate('friends');
        
        res.render('game/new-game', {
            path: '/',
            pageTitle: 'Neues Spiel',
            user: req.session.user,
            friends: user.friends
        });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Ein Fehler ist aufgetreten.');
        res.redirect('/');
    }  
};

exports.getGame = async (req, res, next) => {
    try {
        await authRedirect(req, res, next);
        const user = await User.findById(req.session.user._id).populate('friends');
        const gameId = req.params.gameId;
        console.log('Rendering game page with gameId:', gameId);

        const game = await Game.findById(gameId).populate({
            path: 'users',
            select: 'name email'
        });
        if (!game) {
            return res.redirect('/404');
        }

        const players = game.users;
        const messages = await Message.find({ game: gameId })
            .sort({ createdAt: 1 })
            .populate({
                path: 'sender',
                select: 'name'
            })
            .lean();

        messages.forEach(message => {
            const createdAt = new Date(message.createdAt);
            message.formattedDate = createdAt.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
            message.formattedTime = createdAt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
        });

        const regions = await RegionController.getRegions(gameId);
        const bioms = await BiomController.getRevenueBioms(gameId);
        const miseries = await MiseryController.getMiseries(gameId);
        const cards = await CardController.getCards(gameId);;
        const dices = await DiceController.getDices(gameId);
        const ships = await ShipController.getShips(gameId);
        const troops = await TroopController.getTroops(gameId);
        const progresses = await ProgressController.getGroupedProgresses(gameId);

        const templateData = {
            path: '/',
            pageTitle: game.name,
            user: user,
            game: game,
            userCount: game.users.length,
            regions: regions,
            bioms: bioms,
            miseries: miseries,
            cards: cards,
            dices: dices,
            ships: ships,
            troops: troops,
            messages: messages,
            progresses: progresses,
            players: players,
            gameId: gameId
        };

        res.render('game/game', templateData);
    } catch (error) {
        console.error('Game controller error:', error);
        res.status(404).render('404', {
            pageTitle: 'Game Not Found',
            path: '/404'
        });
    }
};


exports.postGame = async (req, res, next) => {
    const { name, friends } = req.body;
    const userId = req.session.user._id;
    
    const selectedFriends = Array.isArray(friends) ? friends : [friends].filter(Boolean);
    
    if (!selectedFriends || selectedFriends.length < 2) {
        req.flash('error', 'Mindestens 2 Freunde müssen ausgewählt werden.');
        return res.redirect('/new-game');
    }
    
    if (selectedFriends.length > 5) {
        req.flash('error', 'Maximal 5 Freunde können eingeladen werden.');
        return res.redirect('/new-game');
    }

    try {
        const friendUsers = await User.find({ name: { $in: selectedFriends } });
        const friendIds = friendUsers.map(friend => friend._id);
        
        const currentUser = await User.findById(userId);
        
        const updates = [];
        
        for (const playerId of friendIds) {
            const player = await User.findById(playerId);
            if (!player) continue;
            
            if (!currentUser.friends.includes(playerId.toString())) {
                currentUser.friends.push(playerId);
            }
            
            if (!player.friends.includes(userId.toString())) {
                player.friends.push(userId);
                updates.push(player.save());
            }
            
            for (const otherPlayerId of friendIds) {
                if (playerId.toString() === otherPlayerId.toString()) continue;
                
                if (!player.friends.includes(otherPlayerId.toString())) {
                    player.friends.push(otherPlayerId);
                }
                
                const otherPlayer = await User.findById(otherPlayerId);
                if (otherPlayer && !otherPlayer.friends.includes(playerId.toString())) {
                    otherPlayer.friends.push(playerId);
                    updates.push(otherPlayer.save());
                }
            }
        }
        
        updates.push(currentUser.save());
        await Promise.all(updates);
        
        const game = new Game({
            name: name,
            state: 'new',
            created_at: new Date(),
            last_action_at: new Date(),
            users: [userId, ...friendIds],
            data: []
        });
        
        const savedGame = await game.save();
        await BiomController.createBioms(savedGame._id);
        await Region.createRegions(savedGame._id);
        await MiseryController.createMiseries(savedGame._id);
        await CardController.createCards(savedGame._id);
        await DiceController.createDices(savedGame._id);
        await ShipController.createShips(savedGame._id);
        await TroopController.createTroops(savedGame._id);
        await ProgressController.createProgresses(savedGame._id);
        
        req.flash('success', 'Spiel erfolgreich erstellt.');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Ein Fehler ist beim Erstellen des Spiels aufgetreten.');
        res.redirect('/new-game');
    }
};

exports.deleteGame = async (req, res, next) => {
    try {
        const gameId = req.params.gameId;
        const userId = req.session.user._id;

        const game = await Game.findOne({ _id: gameId, users: userId });
        if (!game) {
            req.flash('error', 'Spiel nicht gefunden oder keine Berechtigung.');
            return res.redirect('/');
        }

        await BiomController.deleteBiomsByGameId(gameId);
        await MiseryController.deleteMiseriesByGameId(gameId);
        await CardController.deleteCardsByGameId(gameId);
        await DiceController.deleteDicesByGameId(gameId);
        await ShipController.deleteShipsByGameId(gameId);
        await TroopController.deleteTroopsByGameId(gameId);
        await ProgressController.deleteProgressesByGameId(gameId);
        await RegionController.deleteRegionsByGameId(gameId);
        await MessageController.deleteMessagesByGameId(gameId);
        await Game.findByIdAndDelete(gameId);

        req.flash('success', 'Spiel erfolgreich gelöscht.');
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Fehler beim Löschen des Spiels.');
        res.redirect('/');
    }
};