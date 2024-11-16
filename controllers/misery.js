const Misery = require('../models/misery');
const MiseryController = require('../controllers/misery');

exports.createMiseries = async (game_id) => {
    const miseryData = [
        { index: 0, value: 0, color: '#0000ff', game: game_id },
        { index: 1, value: 10, color: '#0000ff', game: game_id },
        { index: 2, value: 20, color: '#0000ff', game: game_id },
        { index: 3, value: 30, color: '#0000ff', game: game_id },
        { index: 4, value: 40, color: '#0000ff', game: game_id },
        { index: 5, value: 50, color: '#0000ff', game: game_id },
        { index: 6, value: 60, color: '#0000ff', game: game_id },
        { index: 7, value: 70, color: '#0000ff', game: game_id },
        { index: 8, value: 80, color: '#0000ff', game: game_id },
        { index: 9, value: 90, color: '#0000ff', game: game_id },
        { index: 10, value: 100, color: '#0000ff', game: game_id },
        { index: 11, value: 125, color: '#ffff00', game: game_id },
        { index: 12, value: 150, color: '#ffff00', game: game_id },
        { index: 13, value: 175, color: '#ffff00', game: game_id },
        { index: 14, value: 200, color: '#ffff00', game: game_id },
        { index: 15, value: 250, color: '#ff9900', game: game_id },
        { index: 16, value: 300, color: '#ff9900', game: game_id },
        { index: 17, value: 350, color: '#ff9900', game: game_id },
        { index: 18, value: 400, color: '#ff9900', game: game_id },
        { index: 19, value: 450, color: '#ff9900', game: game_id },
        { index: 20, value: 500, color: '#ff9900', game: game_id },
        { index: 21, value: 600, color: '#ff0000', game: game_id },
        { index: 22, value: 700, color: '#ff0000', game: game_id },
        { index: 23, value: 800, color: '#ff0000', game: game_id },
        { index: 24, value: 900, color: '#ff0000', game: game_id },
        { index: 25, value: 1000, color: '#ff0000', game: game_id },
        { index: 26, value: 2000, color: '#ff0000', game: game_id }
    ];

    try {
        await Promise.all(miseryData.map(miseryData => new Misery(miseryData).save()));
    } catch (err) {
        console.error('Fehler beim Erstellen der Miseries:', err);
    }
};

exports.getMiseries = async (game_id) => {
    try {
        const miseries = await Misery.find({ 
            game: game_id
        }).sort({ 'index': 1 });
        return miseries.length ? miseries : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Miseries:', err);
        return null;
    }
};

exports.deleteMiseries = (game_id) => {
    return Misery.deleteMany({ game: game_id })
        .then(deletionResult => {
            if (deletionResult.deletedCount > 0) {
                return true;
            } else {
                console.log('Keine Miseries zum Löschen gefunden.');
                return false; 
            }
        })
        .catch(err => {
            console.error('Fehler beim Löschen der Miseries:', err);
            throw err;
        });
};

exports.deleteMiseriesByGameId = async (gameId) => {
    return await Misery.deleteMany({ game: gameId });
};