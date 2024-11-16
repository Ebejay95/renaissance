const Region = require('../models/region');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Biom = require('../models/biom');
const BiomController = require('../controllers/biom');

async function createRegion(game_id, name, className, biom_type, x, y, size, deg, zone, attackValue) {
    const biom = await BiomController.biomIDByName(game_id, biom_type);
    if (!biom) {
        throw new Error('Biom konnte nicht gefunden werden.');
    }
    return new Region({
        name: name,
        className: className,
        svgPath: '',
        x: x,
        y: y,
        deg: deg,
        size: size,
        zone: zone,
        attackValue: attackValue,
        coasts: [],
        adjacentRegions: [],
        supportedRegions: [],
        biom: biom,
        game: game_id
    });
}

exports.createRegions = async (game_id) => {
    try {
        const regionsData = [
            { name: 'Armagh', className: 'armagh', biom_type: 'supporter', x: 300, y: 300, size: 100, deg: 2, zone: 1, attackValue: 0 },
            { name: 'Bergen', className: 'bergen', biom_type: 'timber', x: 20.4, y: 2.4, size: 10, deg: 0, zone: 2, attackValue: 3 },
            { name: 'Chester', className: 'chester', biom_type: 'metal', x: 300, y: 300, size: 100, deg: 2, zone: 3, attackValue: 0 },
            { name: 'Cornwall', className: 'cornwall', biom_type: 'supporter', x: 300, y: 300, size: 100, deg: 2, zone: 1, attackValue: 0 },
            { name: 'Edinburg', className: 'edinburg', biom_type: 'whool', x: 84, y: 130, size: 51, deg: 2, zone: 2, attackValue: 0 },
            { name: 'Grönland-Meer', className: 'greenlandsea', biom_type: 'sea', x: 42, y: 64, size: 69, deg: 2, zone: 0, attackValue: 0 },
            { name: 'Iceland', className: 'iceland', biom_type: 'ivory', x: 61, y: 99, size: 36, deg: 2, zone: 2, attackValue: 0 },
            { name: 'Königsberg', className: 'koenigsberg', biom_type: 'supporter', x: 209, y: 38, size: 60, deg: 2, zone: 1, attackValue: 0 },
            { name: 'Portsmouth', className: 'portsmouth', biom_type: 'grain', x: 300, y: 300, size: 100, deg: 2, zone: 5, attackValue: 0 },
            { name: 'Shetland Islands', className: 'shetland_islands', biom_type: 'supporter', x: 109, y: 85, size: 37, deg: 2, zone: 1, attackValue: 0 },
            { name: 'Wales', className: 'wales', biom_type: 'supporter', x: 300, y: 300, size: 100, deg: 2, zone: 1, attackValue: 0 },
            { name: 'Waterford', className: 'waterford', biom_type: 'whool', x: 300, y: 300, size: 100, deg: 2, zone: 2, attackValue: 0 },
            { name: 'York', className: 'york', biom_type: 'whool', x: 300, y: 300, size: 100, deg: 2, zone: 3, attackValue: 0 },
            { name: 'Zone', className: 'zone1', biom_type: 'zone', x: 27.26, y: 1.04, size: 49.67, deg: -1, zone: 2, attackValue: 0 },
            { name: 'Zone', className: 'zone2', biom_type: 'zone', x: 0, y: 2.52, size: 32.56, deg: 0, zone: 2, attackValue: 0 },
            { name: 'Zone', className: 'zone3', biom_type: 'zone', x: 11, y: 26.84, size: 48.01, deg: 0, zone: 2, attackValue: 0 },
            { name: 'Zone', className: 'zone4', biom_type: 'zone', x: 7.17, y: 65.14, size: 26.07, deg: -1, zone: 2, attackValue: 0 },
            { name: 'Zone', className: 'zone5', biom_type: 'zone', x: 69.29, y: 21.69, size: 29.92, deg: -1, zone: 2, attackValue: 0 },
            { name: 'Zone', className: 'zone6', biom_type: 'zone', x: 68.17, y: 64.75, size: 27.35, deg: 0, zone: 2, attackValue: 0 },
            { name: 'Zone', className: 'zone7', biom_type: 'zone', x: 17, y: 47.87, size: 44.5, deg: 0, zone: 2, attackValue: 0 },
            { name: 'Zone', className: 'zone8', biom_type: 'zone', x: 5.65, y: 55.86, size: 76.28, deg: 0, zone: 2, attackValue: 0 }
        ];

        for (const regionData of regionsData) {
            const region = await createRegion(
                game_id,
                regionData.name,
                regionData.className,
                regionData.biom_type,
                regionData.x,
                regionData.y,
                regionData.size,
                regionData.deg,
                regionData.zone,
                regionData.attackValue
            );
            await region.save();
            await region.updateSVG();
        }
    } catch (err) {
        console.error('Fehler beim Erstellen der Regionen:', err);
    }
};

exports.deleteRegions = (game_id) => {
    return Region.deleteMany({ game: game_id })
        .then(deletionResult => {
            if (deletionResult.deletedCount > 0) {
                return true;
            } else {
                console.log('Keine Region zum Löschen gefunden.');
                return false;
            }
        })
        .catch(err => {
            console.error('Fehler beim Löschen der Regionen:', err);
            throw err;
        });
};

exports.getRegions = async (game_id) => {
    try {
        const regions = await Region.find({ game: new ObjectId(game_id) });
        return regions.length ? regions : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Regionen:', err);
        return null;
    }
};

exports.deleteRegionsByGameId = async (gameId) => {
    return await Region.deleteMany({ game: gameId });
};
