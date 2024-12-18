const Card = require('../models/card');
const CardController = require('../controllers/card');

exports.createCards = async (game_id) => {
	const cardData = [
		{ label: "Bürgerkrieg", name: "civilWar", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Alchimie", name: "alchimy", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Aufgeklärter Monarch", name: "enlightenedMonarc", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Aufstände", name: "riot", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Pirates", name: "pirats", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Päpstliches Dekret", name: "papalDecree", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Rebellion", name: "rebellion", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Kreuzzüge", name: "crusades", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Rüstung", name: "armor", epoch: 1, recycle: false, state: "stack", type: "event", game: game_id },
		{ label: "Steigbügel", name: "stirrup", epoch: 1, recycle: false, state: "stack", type: "event", game: game_id },
		{ label: "Krieg", name: "war", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Mystizismus", name: "mysticism", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Hungersnot", name: "famine", epoch: 1, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Karl der Große", name: "charlemagne", epoch: 1, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Dionysus Exiguus", name: "dionysusExiguus", epoch: 1, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Walter ohne Geld", name: "walterWithoutMoney", epoch: 1, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "St. Benedikt", name: "stBenedict", epoch: 1, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Rashid-ed-Diin", name: "rashidEdDiin", epoch: 1, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Holz", name: "wood1", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Stein", name: "stone1", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Seide", name: "silk1", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Stoffe/Wein", name: "clothWine", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Gewürze", name: "spice1", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Elfenbein/Gold", name: "ivoryGold", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Stein", name: "stone1", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Wolle", name: "whool1", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Wolle", name: "whool1", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Pelze", name: "fur1", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Metall", name: "metal1", epoch: 1, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Langbogen", name: "longbow", epoch: 2, recycle: false, state: "stack", type: "event", game: game_id },
		{ label: "Schießpulver", name: "gunpowder", epoch: 2, recycle: false, state: "stack", type: "event", game: game_id },
		{ label: "Einfall der Mongolen", name: "mongolInvasion", epoch: 2, recycle: false, state: "stack", type: "event", game: game_id },
		{ label: "Religionskrieg", name: "religiousWar", epoch: 2, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Schwarzer Tod", name: "pestilence", epoch: 2, recycle: true, state: "stack", type: "event", game: game_id },
		{ label: "Achmed Ibn Madjid", name: "achmedIbnMadjid", epoch: 2, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Johannes Gutenberg", name: "johannesGutenberg", epoch: 2, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Christoph Columbus", name: "christoColumbo", epoch: 2, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Desiderus Erasmus", name: "desiderusErasmus", epoch: 2, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "William Caxton", name: "williamCaxton", epoch: 2, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Heinrich der Seefahrer", name: "hernyTheSailor", epoch: 2, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Marco Polo", name: "marcoPolo", epoch: 2, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Nicolaus Kopernicus", name: "nicolaCopernicus", epoch: 2, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Holz", name: "wood2", epoch: 2, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Holz", name: "wood2", epoch: 2, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Seide", name: "silk2", epoch: 2, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Getreide", name: "grain2", epoch: 2, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Getreide", name: "grain2", epoch: 2, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Stoffe", name: "cloth2", epoch: 2, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Gewürze", name: "spice2", epoch: 2, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Wein", name: "wine2", epoch: 2, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Metall", name: "metal2", epoch: 2, recycle: true, state: "stack", type: "biom", game: game_id },
		{ label: "Bartolome de Las Casas", name: "bartolomeDeLasCasas", epoch: 3, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Andreas Vesalius", name: "andrewVersalius", epoch: 3, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Isaac Newton", name: "isaacNewton", epoch: 3, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Leonardo da Vinci", name: "leonardoDaVinci", epoch: 3, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Galileo Galilei", name: "galileoGalilei", epoch: 3, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Heinrich von Oldenburg", name: "henryFromOldenburg", epoch: 3, recycle: false, state: "stack", type: "person", game: game_id },
		{ label: "Seide", name: "silk3", epoch: 3, recycle: false, state: "stack", type: "biom", game: game_id },
		{ label: "Stoffe", name: "cloth3", epoch: 3, recycle: false, state: "stack", type: "biom", game: game_id },
		{ label: "Gold", name: "gold3", epoch: 3, recycle: false, state: "stack", type: "biom", game: game_id },
		{ label: "Gewürze", name: "spice3", epoch: 3, recycle: false, state: "stack", type: "biom", game: game_id },
		{ label: "Wein", name: "wine3", epoch: 3, recycle: false, state: "stack", type: "biom", game: game_id },
		{ label: "Pelze", name: "fur3", epoch: 3, recycle: false, state: "stack", type: "biom", game: game_id },
		{ label: "Metall", name: "metal3", epoch: 3, recycle: false, state: "stack", type: "biom", game: game_id }
	];

	try {
		await Promise.all(cardData.map(cardData => new Card(cardData).save()));
	} catch (err) {
		console.error('Fehler beim Erstellen der Cards:', err);
	}
};

exports.getCards = async (game_id) => {
	try {
		const cards = await Card.find({
			game: game_id
		});
		return cards.length ? cards : null;
	} catch (err) {
		console.error('Fehler beim Abrufen der Cards:', err);
		return null;
	}
};

exports.deleteCards = (game_id) => {
	return Card.deleteMany({ game: game_id })
		.then(deletionResult => {
			if (deletionResult.deletedCount > 0) {
				return true;
			} else {
				console.log('Keine Cards zum Löschen gefunden.');
				return false;
			}
		})
		.catch(err => {
			console.error('Fehler beim Löschen der Cards:', err);
			throw err;
		});
};

exports.deleteCardsByGameId = async (gameId) => {
	return await Card.deleteMany({ game: gameId });
};