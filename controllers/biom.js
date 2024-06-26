const Biom = require('../models/biom');
const BiomController = require('../controllers/biom');

exports.createBioms = async (game_id) => {
    const biomsData = [
        { name: 'Stein', className: 'stone', color: '#aa7733', revenues: [1, 4, 9, 16, 25, 36, 49, 64], availability: 'neutral', game: game_id },
        { name: 'Wolle', className: 'whool', color: '#660077', revenues: [2, 8, 18, 32, 50, 72, 98, 128, 162], availability: 'neutral', game: game_id },
        { name: 'Holz', className: 'timber', color: '#006600', revenues: [3, 12, 27, 48, 75, 108, 147], availability: 'neutral', game: game_id },
        { name: 'Weizen', className: 'grain', color: '#ccbbaa', revenues: [4, 16, 36, 64, 100, 144, 196, 256], availability: 'neutral', game: game_id },
        { name: 'Stoffe', className: 'cloth', color: '#ff4400', revenues: [8, 20, 45, 80, 125, 180, 245, 320], availability: 'neutral', game: game_id },
        { name: 'Wein', className: 'wine', color: '#aa0022', revenues: [5, 20, 45, 80, 125, 180], availability: 'neutral', game: game_id },
        { name: 'Metall', className: 'metal', color: '#444', revenues: [6, 24, 54, 96, 150, 216, 294], availability: 'neutral', game: game_id },
        { name: 'Pelze', className: 'fur', color: '#552200', revenues: [7, 28, 63, 112, 175], availability: 'neutral', game: game_id },
        { name: 'Seide', className: 'silk', color: '#0000aa', revenues: [8, 32, 72, 128, 200, 288], availability: 'neutral', game: game_id },
        { name: 'Gewürze', className: 'spice', color: '#dd1111', revenues: [9, 36, 81, 144, 225, 324, 441], availability: 'neutral', game: game_id },
        { name: 'Gold', className: 'gold', color: '#ffff00', revenues: [10, 40, 90, 160, 250], availability: 'neutral', game: game_id },
        { name: 'Elfenbein', className: 'ivory', color: '#ffffff', revenues: [10, 40, 90, 160], availability: 'neutral', game: game_id },
        { name: 'Unterstützer', className: 'supporter', color: '#ddd', revenues: [], availability: 'neutral', game: game_id },
        { name: 'Küste', className: 'coast', color: '#aaddff', revenues: [], availability: 'neutral', game: game_id },
        { name: 'Meer', className: 'sea', color: '#1155ff', revenues: [], availability: 'neutral', game: game_id },
        { name: 'Zone', className: 'zone', color: 'inherit', revenues: [], availability: 'neutral', game: game_id }
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

exports.getBioms = (game_id) => {
    Biom.find({ game: game_id })
        .then(bioms => {
            if (bioms.length) {
                return (bioms);
            } else {
                return (null);
            }
        })
        .catch(err => {
            console.error('Fehler beim Abrufen der Biome:', err);
			return (null);
        });
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