const Dice = require('../models/dice');
const DiceController = require('../controllers/dice');

exports.createDices = async (game_id) => {
    const diceData = [
        { index: 0, name: "white", value: 6, color: "#fff", dotColor: "#000", game: game_id },
        { index: 1, name: "black", value: 6, color: "#000", dotColor: "#fff", game: game_id },
        { index: 2, name: "green", value: 6, color: "#005500", dotColor: "#fff", game: game_id }
    ];

    try {
        await Promise.all(diceData.map(diceData => new Dice(diceData).save()));
    } catch (err) {
        console.error('Fehler beim Erstellen der Dices:', err);
    }
};

exports.getDices = async (game_id) => {
    try {
        const dices = await Dice.find({ 
            game: game_id
        });
        return dices.length ? dices : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Dices:', err);
        return null;
    }
};

exports.deleteDices = (game_id) => {
    return Dice.deleteMany({ game: game_id })
        .then(deletionResult => {
            if (deletionResult.deletedCount > 0) {
                return true;
            } else {
                console.log('Keine Dices zum Löschen gefunden.');
                return false; 
            }
        })
        .catch(err => {
            console.error('Fehler beim Löschen der Dices:', err);
            throw err;
        });
};

exports.deleteDicesByGameId = async (gameId) => {
    return await Dice.deleteMany({ game: gameId });
};