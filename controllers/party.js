const Party = require('../models/party');
const PartyController = require('../controllers/party');

exports.createParties = async (game_id) => {
    const partiesData = [
        { name: 'Hamburg', className: 'hamburg', color: '#c17d4f', inGameAt: 6, game: game_id },
        { name: 'London', className: 'london', color: '#6c9649', inGameAt: 5, game: game_id },
        { name: 'Paris', className: 'paris', color: '#812327', inGameAt: 4, game: game_id },
        { name: 'Venedig', className: 'venezia', color: '#d59f3c', inGameAt: 3, game: game_id },
        { name: 'Genua', className: 'genoa', color: '#674582', inGameAt: 3, game: game_id },
        { name: 'Barcelona', className: 'barcelona', color: '#286c98', inGameAt: 3, game: game_id },
    ];

    try {
        await Promise.all(partiesData.map(partyData => new Party(partyData).save()));
    } catch (err) {
        console.error('Fehler beim Erstellen der Parties:', err);
    }
};

exports.partyIDByName = async (game_id, name) => {
    try {
        const parties = await Party.find({ game: game_id, className: name });
        return parties.length > 0 ? parties[0] : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Parties:', err);
        return null;
    }
};

exports.getParties = async (game_id) => {
    try {
        const parties = await Party.find({ game: game_id });
        return parties.length ? parties : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Parties:', err);
        return null;
    }
};

 exports.getRevenueParties = async (game_id) => {
	try {
		const parties = await Party.find({
			game: game_id,
			revenues: { $exists: true, $ne: [] }
		}).sort({ 'revenues.0': 1 });
		return parties.length ? parties : null;
	} catch (err) {
		console.error('Fehler beim Abrufen der Parties:', err);
		return null;
	}
 };

exports.deleteParties = (game_id) => {
    return Party.deleteMany({ game: game_id })
        .then(deletionResult => {
            if (deletionResult.deletedCount > 0) {
                return true;
            } else {
                console.log('Keine Parties zum Löschen gefunden.');
                return false;
            }
        })
        .catch(err => {
            console.error('Fehler beim Löschen der Parties:', err);
            throw err;
        });
};

exports.deletePartiesByGameId = async (gameId) => {
    return await Party.deleteMany({ game: gameId });
};