const Biom = require('../models/biom');
const BiomController = require('../controllers/biom');

exports.createBioms = async (game_id) => {
    const biomsData = [
        { name: 'Stein', className: 'stone', color: '#b46532', revenues: [1, 4, 9, 16, 25, 36, 49, 64], epoch: "2 / 0 / 0", availability: 'neutral', game: game_id },
        { name: 'Wolle', className: 'whool', color: '#623b70', revenues: [2, 8, 18, 32, 50, 72, 98, 128, 162], epoch: "2 / 0 / 0", availability: 'neutral', game: game_id },
        { name: 'Holz', className: 'timber', color: '#2b9b50', revenues: [3, 12, 27, 48, 75, 108, 147], epoch: "1 / 2 / 0", availability: 'neutral', game: game_id },
        { name: 'Getreide', className: 'grain', color: '#98b035', revenues: [4, 16, 36, 64, 100, 144, 196, 256], epoch: "0 / 2 / 0", availability: 'neutral', game: game_id },
        { name: 'Stoffe', className: 'cloth', color: '#dc2d37', revenues: [8, 20, 45, 80, 125, 180, 245, 320], epoch: "1*/ 1 / 1", availability: 'neutral', game: game_id },
        { name: 'Wein', className: 'wine', color: '#ba2d4f', revenues: [5, 20, 45, 80, 125, 180], epoch: "1*/ 1 / 1", availability: 'neutral', game: game_id },
        { name: 'Metall', className: 'metal', color: '#212121', revenues: [6, 24, 54, 96, 150, 216, 294], epoch: "1 / 1 / 1", availability: 'neutral', game: game_id },
        { name: 'Pelze', className: 'fur', color: '#723933', revenues: [7, 28, 63, 112, 175], epoch: "1 / 0 / 1", availability: 'neutral', game: game_id },
        { name: 'Seide', className: 'silk', color: '#364165', revenues: [8, 32, 72, 128, 200, 288], epoch: "1 / 1 / 1", availability: 'neutral', game: game_id },
        { name: 'Gewürze', className: 'spice', color: '#e7683d', revenues: [9, 36, 81, 144, 225, 324, 441], epoch: "1 / 1 / 1", availability: 'neutral', game: game_id },
        { name: 'Gold', className: 'gold', color: '#e0cd57', revenues: [10, 40, 90, 160, 250], epoch: "1* / 0 / 1", availability: 'neutral', game: game_id },
        { name: 'Elfenbein', className: 'ivory', color: '#e2e0e1', revenues: [10, 40, 90, 160], epoch: "1* / 0 / 0", availability: 'neutral', game: game_id },
        { name: 'Unterstützer', className: 'supporter', color: '#ddd', revenues: [], epoch: "", availability: 'neutral', game: game_id },
        { name: 'Küste', className: 'coast', color: '#ffffff44', revenues: [], epoch: "", availability: 'neutral', game: game_id },
        { name: 'Meer', className: 'sea', color: '#ffffff22', revenues: [], epoch: "", availability: 'neutral', game: game_id },
        { name: 'Zone', className: 'zone', color: 'inherit', revenues: [], epoch: "", availability: 'neutral', game: game_id }
    ];

    try {
        await Promise.all(biomsData.map(biomData => new Biom(biomData).save()));
    } catch (err) {
        console.error('Fehler beim Erstellen der Biome:', err);
    }
};

exports.biomIDByName = async (game_id, name) => {
    try {
        const bioms = await Biom.find({ game: game_id, className: name });
        return bioms.length > 0 ? bioms[0] : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Biome:', err);
        return null;
    }
};

exports.getBioms = async (game_id) => {
    try {
        const bioms = await Biom.find({ game: game_id });
        return bioms.length ? bioms : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Biome:', err);
        return null;
    }
};

 exports.getRevenueBioms = async (game_id) => {
	try {
		const bioms = await Biom.find({
			game: game_id,
			revenues: { $exists: true, $ne: [] }
		}).sort({ 'revenues.0': 1 });
		return bioms.length ? bioms : null;
	} catch (err) {
		console.error('Fehler beim Abrufen der Biome:', err);
		return null;
	}
 };

exports.deleteBioms = (game_id) => {
    return Biom.deleteMany({ game: game_id })
        .then(deletionResult => {
            if (deletionResult.deletedCount > 0) {
                return true;
            } else {
                console.log('Keine Biome zum Löschen gefunden.');
                return false;
            }
        })
        .catch(err => {
            console.error('Fehler beim Löschen der Biome:', err);
            throw err;
        });
};

exports.deleteBiomsByGameId = async (gameId) => {
    return await Biom.deleteMany({ game: gameId });
};