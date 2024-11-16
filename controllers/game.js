const { authRedirect } = require('./auth');
const User = require('../models/user');
const Game = require('../models/game');
const Biom = require('../models/biom');
const Misery = require('../models/misery');
const Ship = require('../models/ship');
const Troop = require('../models/troop');
const Progress = require('../models/progress');
const Message = require('../models/message');
const BiomController = require('../controllers/biom');
const Region = require('./region');
const RegionController = require('../controllers/region');
const MessageController = require('../controllers/message');
const MiseryController = require('../controllers/misery');
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

        // Spiel finden und User-Daten abrufen
        const game = await Game.findById(gameId).populate({
            path: 'users',
            select: 'name email' // Wähle die Felder aus, die du brauchst
        });
        if (!game) {
            return res.redirect('/404');
        }

        // Benutzer-Daten in `players` speichern
        const players = game.users;

        // Nachrichten für dieses Spiel abrufen
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
            ships: ships,
            troops: troops,
            messages: messages,
            progresses: progresses,
            players: players, // Hier fügen wir die Spieler hinzu
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
    
    // Convert friends to array if single value
    const selectedFriends = Array.isArray(friends) ? friends : [friends].filter(Boolean);
    
    // Check minimum and maximum players
    if (!selectedFriends || selectedFriends.length < 2) {
        req.flash('error', 'Mindestens 2 Freunde müssen ausgewählt werden.');
        return res.redirect('/new-game');
    }
    
    if (selectedFriends.length > 5) {
        req.flash('error', 'Maximal 5 Freunde können eingeladen werden.');
        return res.redirect('/new-game');
    }

    try {
        // Get all friend users
        const friendUsers = await User.find({ name: { $in: selectedFriends } });
        const friendIds = friendUsers.map(friend => friend._id);
        
        // Get the creating user
        const currentUser = await User.findById(userId);
        
        // Make all players mutual friends
        const updates = [];
        
        // For each player (including friends)
        for (const playerId of friendIds) {
            const player = await User.findById(playerId);
            if (!player) continue;
            
            // Make current user friend with player (if not already friends)
            if (!currentUser.friends.includes(playerId.toString())) {
                currentUser.friends.push(playerId);
            }
            
            // Make player friend with current user (if not already friends)
            if (!player.friends.includes(userId.toString())) {
                player.friends.push(userId);
                updates.push(player.save());
            }
            
            // Make all other players mutual friends
            for (const otherPlayerId of friendIds) {
                if (playerId.toString() === otherPlayerId.toString()) continue;
                
                // Add friend only if not already in the list
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
        
        // Save all user updates
        updates.push(currentUser.save());
        await Promise.all(updates);
        
        // Create the game
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