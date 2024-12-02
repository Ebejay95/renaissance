const Region = require('../models/region');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Biom = require('../models/biom');
const BiomController = require('../controllers/biom');

async function createRegion(game_id, name, className, biom_type, x, y, size, deg, zone, attackValue, transX, transY) {
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
        transX: transX,
        transY: transY,
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
			// Zone 1
            { name: 'Zone', className: 'zone1', biom_type: 'zone', x: 27.26, y: 1.04, size: 49.67, deg: -1, zone: 1, attackValue: 0 , transX: 0, transY: 0},
			// Zone 2
            { name: 'Zone', className: 'zone2', biom_type: 'zone', x: 0, y: 2.52, size: 32.56, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Armagh', className: 'armagh', biom_type: 'supporter', x: 2.6, y: 33, size: 7.6, deg: 0, zone: 2, attackValue: 1 , transX: 0, transY: 0},
            { name: 'Armagh Küste', className: 'armagh_coast', biom_type: 'coast', x: 2.8, y: 32.8, size: 6.1, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Bergen', className: 'bergen', biom_type: 'timber', x: 20.4, y: 2.3, size: 10, deg: 0, zone: 2, attackValue: 3 , transX: 0, transY: 50},
            { name: 'Bergen Küste', className: 'bergen_coast', biom_type: 'coast', x: 13.4, y: 2.5, size: 11.2, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Chester Küste', className: 'chester_coast', biom_type: 'coast', x: 12.4, y: 43.3, size: 2.1, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Chester', className: 'chester', biom_type: 'metal', x: 11.1, y: 31.6, size: 5.1, deg: 0, zone: 2, attackValue: 3 , transX: 0, transY: 0},
            { name: 'Cornwall Wüste', className: 'cornwall_coast', biom_type: 'coast', x: 9.1, y: 44.9, size: 6, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Cornwall', className: 'cornwall', biom_type: 'supporter', x: 11.3, y: 44.3, size: 5, deg: 0, zone: 2, attackValue: 1 , transX: 0, transY: 0},
            { name: 'Edinburg', className: 'edinburg', biom_type: 'whool', x: 5.6, y: 23.1, size: 7.6, deg: 1, zone: 2, attackValue: 2 , transX: 0, transY: 0},
            { name: 'Edinburg Küste', className: 'edinburg_coast', biom_type: 'coast', x: 2.6, y: 20.4, size: 11.2, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Grönland-Meer', className: 'greenlandsea', biom_type: 'sea', x: 0.3, y: 12.4, size: 9.6, deg: 2, zone: 0, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Iceland', className: 'iceland', biom_type: 'ivory', x: 2.7, y: 18.1, size: 5.2, deg: 1, zone: 2, attackValue: 2 , transX: 0, transY: 0},
            { name: 'Königsberg', className: 'koenigsberg', biom_type: 'supporter', x: 23.2, y: 7, size: 9, deg: 2, zone: 2, attackValue: 1 , transX: 0, transY: 0},
            { name: 'Königsberg Küste', className: 'koenigsberg_coast', biom_type: 'coast', x: 21.1, y: 12.8, size: 11.2, deg: -1, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Portsmouth Küste West', className: 'portsmouth_coast_west', biom_type: 'coast', x: 12.9, y: 43.2, size: 2.3, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Portsmouth Küste Süd', className: 'portsmouth_coast_south', biom_type: 'coast', x: 14.8, y: 45.5, size: 4.4, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Portsmouth', className: 'portsmouth', biom_type: 'grain', x: 12.9, y: 38.7, size: 5.7, deg: 0, zone: 2, attackValue: 5 , transX: 0, transY: 0},
            { name: 'Shetland Islands Küste', className: 'shetland_islands_coast', biom_type: 'coast', x: 8.9, y: 13.4, size: 6, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Shetland Islands', className: 'shetland_islands', biom_type: 'supporter', x: 9.5, y: 14.9, size: 6.3, deg: 0, zone: 2, attackValue: 1 , transX: 0, transY: 0},
            { name: 'Wales Küste', className: 'wales_coast', biom_type: 'coast', x: 8.4, y: 37.1, size: 4.3, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Wales', className: 'wales', biom_type: 'supporter', x: 7.3, y: 38.6, size: 6.7, deg: 0, zone: 2, attackValue: 1 , transX: 0, transY: 0},
            { name: 'Waterford Küste', className: 'waterford_coast', biom_type: 'coast', x: 1, y: 38.6, size: 7.8, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'Waterford', className: 'waterford', biom_type: 'whool', x: 1.1, y: 38.1, size: 6.1, deg: 0, zone: 2, attackValue: 2 , transX: 0, transY: 0},
            { name: 'York Küste', className: 'york_coast', biom_type: 'coast', x: 13.2, y: 29.3, size: 6.9, deg: 0, zone: 2, attackValue: 0 , transX: 0, transY: 0},
            { name: 'York', className: 'york', biom_type: 'whool', x: 12.5, y: 30.3, size: 6.7, deg: 0, zone: 2, attackValue: 3 , transX: 0, transY: 0},
			// Zone 3
            { name: 'Zone', className: 'zone3', biom_type: 'zone', x: 11, y: 26.84, size: 48.01, deg: 0, zone: 3, attackValue: 0 , transX: 0, transY: 0},
			// Zone 4
            { name: 'Zone', className: 'zone4', biom_type: 'zone', x: 7.17, y: 65.14, size: 26.07, deg: -1, zone: 4, attackValue: 0 , transX: 0, transY: 0},
			// Zone 5
            { name: 'Zone', className: 'zone5', biom_type: 'zone', x: 69.29, y: 21.69, size: 29.92, deg: -1, zone: 5, attackValue: 0 , transX: 0, transY: 0},
			// Zone 6
            { name: 'Zone', className: 'zone6', biom_type: 'zone', x: 68.17, y: 64.75, size: 27.35, deg: 0, zone: 6, attackValue: 0 , transX: 0, transY: 0},
			// Zone 7
            { name: 'Zone', className: 'zone7', biom_type: 'zone', x: 17, y: 47.87, size: 44.5, deg: 0, zone: 7, attackValue: 0 , transX: 0, transY: 0},
			// Zone 8
            { name: 'Zone', className: 'zone8', biom_type: 'zone', x: 5.65, y: 55.86, size: 76.28, deg: 0, zone: 8, attackValue: 0 , transX: 0, transY: 0}
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
                regionData.attackValue,
                regionData.transX,
                regionData.transY
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
