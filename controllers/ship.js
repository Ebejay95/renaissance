const Ship = require('../models/ship');
const ShipController = require('../controllers/ship');

exports.createShips = async (game_id) => {
    const shipData = [
        { index: 0, value: 2, size: 'small', label: 'Küstenprovinzen', game: game_id },
        { index: 1, value: 4, size: 'small', label: 'Küstenprovinzen', game: game_id },
        { index: 2, value: 6, size: 'small', label: 'Küstenprovinzen', game: game_id },
        { index: 3, value: 8, size: 'small', label: 'Küstenprovinzen', game: game_id },
        { index: 4, value: 10, size: 'medium', label: 'Meer', game: game_id },
        { index: 5, value: 12, size: 'medium', label: 'Meer', game: game_id },
        { index: 6, value: 14, size: 'medium', label: 'Meer', game: game_id },
        { index: 7, value: 16, size: 'medium', label: 'Meer', game: game_id },
        { index: 8, value: 1, size: 'large', label: 'Hochsee', game: game_id },
        { index: 9, value: 2, size: 'large', label: 'Hochsee', game: game_id },
        { index: 10, value: 3, size: 'large', label: 'Hochsee', game: game_id },
        { index: 11, value: 4, size: 'large', label: 'Hochsee', game: game_id }
    ];

    try {
        await Promise.all(shipData.map(shipData => new Ship(shipData).save()));
    } catch (err) {
        console.error('Fehler beim Erstellen der Ships:', err);
    }
};

exports.getShips = async (game_id) => {
    try {
        const ships = await Ship.find({ 
            game: game_id
        }).sort({ 'index': 1 });
        return ships.length ? ships : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Ships:', err);
        return null;
    }
};

exports.deleteShips = (game_id) => {
    return Ship.deleteMany({ game: game_id })
        .then(deletionResult => {
            if (deletionResult.deletedCount > 0) {
                return true;
            } else {
                console.log('Keine Ships zum Löschen gefunden.');
                return false; 
            }
        })
        .catch(err => {
            console.error('Fehler beim Löschen der Ships:', err);
            throw err;
        });
};

exports.deleteShipsByGameId = async (gameId) => {
    return await Ship.deleteMany({ game: gameId });
};