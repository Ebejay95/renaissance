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
        //const armagh = await createRegion(game_id, 'Armagh', 'armagh', 'supporter', 300, 300, 100, 2, 1);
        //await armagh.save();
        //await armagh.updateSVG();
        //await armagh.addCoast('armagh_coast', 300, 300, 100);

        const bergen = await createRegion(game_id, 'Bergen', 'bergen', 'timber', 20.4, 2.4, 10, 0, 2, 3);
        await bergen.save();
        await bergen.updateSVG();
        await bergen.addCoast('bergen_coast', 13, 2.47, 11.5, 0);

        //const chester = await createRegion(game_id, 'Chester', 'chester', 'metal', 300, 300, 100, 2, 3);
        //await chester.save();
        //await chester.updateSVG();
        //await chester.addCoast('chester_coast', 300, 300, 100);
		//
        //const cornwall = await createRegion(game_id, 'Cornwall', 'cornwall', 'supporter', 300, 300, 100, 2, 1);
        //await cornwall.save();
        //await cornwall.updateSVG();
        //await cornwall.addCoast('cornwall_coast', 300, 300, 100);
        //await cornwall.addCoast('cornwall_coast2', 300, 300, 100);
		//
        //const edinburg = await createRegion(game_id, 'Edinburg', 'edinburg', 'whool', 84, 130, 51, 2, 2);
        //await edinburg.save();
        //await edinburg.updateSVG();
        //await edinburg.addCoast('edinburg_coast', 62, 114, 77);
		//
        //const greenlandsea = await createRegion(game_id, 'Grönland-Meer', 'greenlandsea', 'sea', 42, 64, 69, 2, 0);
        //await greenlandsea.save();
        //await greenlandsea.updateSVG();
		//
        //const iceland = await createRegion(game_id, 'Iceland', 'iceland', 'ivory', 61, 99, 36, 2, 2);
        //await iceland.save();
        //await iceland.updateSVG();
		//
        //const koenigsberg = await createRegion(game_id, 'Königsberg', 'koenigsberg', 'supporter', 209, 38, 60, 2, 1);
        //await koenigsberg.save();
        //await koenigsberg.updateSVG();
        //await koenigsberg.addCoast('koenigsberg_coast', 195, 71, 75);
		//
        //const portsmouth = await createRegion(game_id, 'Portsmouth', 'portsmouth', 'grain', 300, 300, 100, 2, 5);
        //await portsmouth.save();
        //await portsmouth.updateSVG();
        //await portsmouth.addCoast('portsmouth_coast_south', 300, 300, 100);
        //await portsmouth.addCoast('portsmouth_coast_west', 300, 300, 100);
		//
        //const shetland_islands = await createRegion(game_id, 'Shetland Islands', 'shetland_islands', 'supporter', 109, 85, 37, 2, 1);
        //await shetland_islands.save();
        //await shetland_islands.updateSVG();
        //await shetland_islands.addCoast('shetland_islands_coast', 106, 77, 35);
		//
        //const wales = await createRegion(game_id, 'Wales', 'wales', 'supporter', 300, 300, 100, 2, 1);
        //await wales.save();
        //await wales.updateSVG();
        //await wales.addCoast('wales_coast', 300, 300, 100);
		//
        //const waterford = await createRegion(game_id, 'Waterford', 'waterford', 'whool', 300, 300, 100, 2, 2);
        //await waterford.save();
        //await waterford.updateSVG();
        //await waterford.addCoast('wales_coast', 300, 300, 100);
		//
        //const york = await createRegion(game_id, 'York', 'york', 'whool', 300, 300, 100, 2, 3);
        //await york.save();
        //await york.updateSVG();
        //await york.addCoast('york_coast', 300, 300, 100);
		const zone1 = await createRegion(game_id, 'Zone', 'zone1', 'zone', 27.26, 1.04, 49.67, -1, 2, 0);
		await zone1.save();
		await zone1.updateSVG();
			
		const zone2 = await createRegion(game_id, 'Zone', 'zone2', 'zone', 0, 2.52, 32.56, 0, 2, 0);
		await zone2.save();
		await zone2.updateSVG();
			
		// Korrektur: Verwendung der Prozentwerte anstatt der Pixelwerte für zone3
		const zone3 = await createRegion(game_id, 'Zone', 'zone3', 'zone', 11, 26.84, 48.01, 0, 2, 0);
		await zone3.save();
		await zone3.updateSVG();
			
		// Korrektur: Verwendung der Prozentwerte anstatt der Pixelwerte für zone4
		const zone4 = await createRegion(game_id, 'Zone', 'zone4', 'zone', 7.17, 65.14, 26.07, -1, 2, 0);
		await zone4.save();
		await zone4.updateSVG();
			
		// Korrektur: Verwendung der Prozentwerte anstatt der Pixelwerte für zone5
		const zone5 = await createRegion(game_id, 'Zone', 'zone5', 'zone', 69.29, 21.69, 29.92, -1, 2, 0);
		await zone5.save();
		await zone5.updateSVG();
			
		// Korrektur: Verwendung der Prozentwerte anstatt der Pixelwerte für zone6
		const zone6 = await createRegion(game_id, 'Zone', 'zone6', 'zone', 68.17, 64.75, 27.35, 0, 2, 0);
		await zone6.save();
		await zone6.updateSVG();
			
		// Korrektur: Verwendung der Prozentwerte anstatt der Pixelwerte für zone7
		const zone7 = await createRegion(game_id, 'Zone', 'zone7', 'zone', 17, 47.87, 44.5, 0, 2, 0);
		await zone7.save();
		await zone7.updateSVG();
			
		// Korrektur: Verwendung der Prozentwerte anstatt der Pixelwerte für zone8
		const zone8 = await createRegion(game_id, 'Zone', 'zone8', 'zone', 5.65, 55.86, 76.28, 0, 2, 0);
		await zone8.save();
		await zone8.updateSVG();

    } catch (err) {
        console.error(err);
    }
};
exports.deleteRegions = (game_id) => {
    return Region.deleteMany({ game: game_id })
        .then(deletionResult => {
            if (deletionResult.deletedCount > 0) {
                return true; // Erfolg
            } else {
                console.log('Keine Region zum Löschen gefunden.');
                return false; // Keine Dokumente gelöscht
            }
        })
        .catch(err => {
            console.error('Fehler beim Löschen der Region:', err);
            throw err; // Weiterreichen des Fehlers oder entsprechende Fehlerbehandlung
        });
};
exports.getRegions = async (game_id) => {
    try {
        const regions = await Region.find({ game: new ObjectId(game_id) });
        return regions.length ? regions : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Regions:', err);
        return null;
    }
};

exports.deleteRegionsByGameId = async (gameId) => {
    return await Region.deleteMany({ game: gameId });
};