const Region = require('../models/region');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Biom = require('../models/biom');
const BiomController = require('../controllers/biom');

async function createRegion(game_id, name, className, biom_type, x, y, size, deg, zone, attackValue, transX, transY, capitol) {
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
		capitol: capitol,
		game: game_id
	});
}

exports.createRegions = async (game_id) => {
	try {
		const regionsData = [
			// Zone 1
			{ name: 'Zone', className: 'zone1', biom_type: 'zone', x: 27.26, y: 1.04, size: 49.67, deg: -1, zone: 1, attackValue: 0, transX: 0, transY: 0, capitol: false },
			// Zone 2
			{ name: 'Zone', className: 'zone2', biom_type: 'zone', x: 0, y: 2.52, size: 32.56, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Armagh', className: 'armagh', biom_type: 'supporter', x: 2.6, y: 33, size: 7.6, deg: 0, zone: 2, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Armagh Küste', className: 'armagh_coast', biom_type: 'coast', x: 2.8, y: 32.8, size: 6.1, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Bergen', className: 'bergen', biom_type: 'timber', x: 20.4, y: 2.3, size: 10, deg: 0, zone: 2, attackValue: 3, transX: 0, transY: 50, capitol: false },
			{ name: 'Bergen Küste', className: 'bergen_coast', biom_type: 'coast', x: 13.4, y: 2.5, size: 11.2, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Chester Küste', className: 'chester_coast', biom_type: 'coast', x: 12.4, y: 43.3, size: 2.1, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Chester Nordwest Küste', className: 'chester_coast_northwest', biom_type: 'coast', x: 8.4, y: 33.7, size: 4.7, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Chester', className: 'chester', biom_type: 'metal', x: 11.1, y: 31.6, size: 5.1, deg: 0, zone: 2, attackValue: 3, transX: 0, transY: 0, capitol: false },
			{ name: 'Cornwall Wüste', className: 'cornwall_coast', biom_type: 'coast', x: 9.1, y: 44.9, size: 6, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Cornwall', className: 'cornwall', biom_type: 'supporter', x: 11.3, y: 44.3, size: 5, deg: 0, zone: 2, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Edinburg', className: 'edinburg', biom_type: 'whool', x: 5.6, y: 23.1, size: 7.6, deg: 1, zone: 2, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'Edinburg Küste', className: 'edinburg_coast', biom_type: 'coast', x: 2.6, y: 20.4, size: 11.2, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Grönland-Meer', className: 'greenlandsea', biom_type: 'sea', x: 0.3, y: 12.4, size: 9.6, deg: 2, zone: 0, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Iceland', className: 'iceland', biom_type: 'ivory', x: 2.7, y: 18.1, size: 5.2, deg: 1, zone: 2, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'Königsberg', className: 'koenigsberg', biom_type: 'supporter', x: 23.2, y: 7, size: 9, deg: 2, zone: 2, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Königsberg Küste', className: 'koenigsberg_coast', biom_type: 'coast', x: 21.1, y: 12.8, size: 11.2, deg: -1, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'London', className: 'london', biom_type: 'whool', x: 17.2, y: 36.9, size: 5, deg: 1, zone: 2, attackValue: 5, transX: 0, transY: 0, capitol: true },
			{ name: 'London Küste', className: 'london_coast', biom_type: 'coast', x: 17.9, y: 34.7, size: 4.87, deg: 1, zone: 2, attackValue: 5, transX: 0, transY: 0, capitol: false },
			{ name: 'Portsmouth Küste West', className: 'portsmouth_coast_west', biom_type: 'coast', x: 12.9, y: 43.2, size: 2.3, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Portsmouth Küste Süd', className: 'portsmouth_coast_south', biom_type: 'coast', x: 14.8, y: 45.5, size: 4.4, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Portsmouth', className: 'portsmouth', biom_type: 'grain', x: 12.9, y: 38.7, size: 5.7, deg: 0, zone: 2, attackValue: 5, transX: 0, transY: 0, capitol: false },
			{ name: 'Shetland Islands Küste', className: 'shetland_islands_coast', biom_type: 'coast', x: 8.9, y: 13.4, size: 6, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Shetland Islands', className: 'shetland_islands', biom_type: 'supporter', x: 9.5, y: 14.9, size: 6.3, deg: 0, zone: 2, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Wales Küste', className: 'wales_coast', biom_type: 'coast', x: 8.4, y: 37.1, size: 4.3, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Wales', className: 'wales', biom_type: 'supporter', x: 7.3, y: 38.6, size: 6.7, deg: 0, zone: 2, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Waterford Küste', className: 'waterford_coast', biom_type: 'coast', x: 1, y: 38.6, size: 7.8, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Waterford', className: 'waterford', biom_type: 'whool', x: 1.1, y: 38.1, size: 6.1, deg: 0, zone: 2, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'York Küste', className: 'york_coast', biom_type: 'coast', x: 13.2, y: 29.3, size: 6.9, deg: 0, zone: 2, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'York', className: 'york', biom_type: 'whool', x: 12.5, y: 30.3, size: 6.7, deg: 0, zone: 2, attackValue: 3, transX: 0, transY: 0, capitol: false },
			// Zone 3
			{ name: 'Zone', className: 'zone3', biom_type: 'zone', x: 11, y: 26.84, size: 48.01, deg: 0, zone: 3, attackValue: 0, transX: 0, transY: 0, capitol: false },
			// Zone 4
			{ name: 'Zone', className: 'zone4', biom_type: 'zone', x: 7.17, y: 65.14, size: 26.07, deg: 0, zone: 4, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Barcelona Küste', className: 'barcelona_coast', biom_type: 'coast', x: 27.6, y: 66.6, size: 5.1, deg: -1, zone: 4, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Barcelona', className: 'barcelona', biom_type: 'wine', x: 23.7, y: 65.4, size: 7.3, deg: -1, zone: 4, attackValue: 3, transX: 0, transY: 0, capitol: true },
			{ name: 'Leon Küste', className: 'leon_coast', biom_type: 'coast', x: 7.2, y: 65.9, size: 10, deg: -1, zone: 4, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Leon', className: 'leon', biom_type: 'supporter', x: 9, y: 68.9, size: 10.9, deg: -1, zone: 4, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Lisboa Küste', className: 'lisboa_coast', biom_type: 'coast', x: 9.1, y: 74.8, size: 3.65, deg: -1, zone: 4, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Lisboa', className: 'lisboa', biom_type: 'wine', x: 10.6, y: 75.1, size: 5.6, deg: -1, zone: 4, attackValue: 3, transX: 0, transY: 0, capitol: false },
			{ name: 'Palma Küste', className: 'palma_coast', biom_type: 'coast', x: 28.3, y: 75.6, size: 4.5, deg: -1, zone: 4, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Palma', className: 'palma', biom_type: 'supporter', x: 27.1, y: 74.7, size: 4.4, deg: -1, zone: 4, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'San Sebastian Küste', className: 'san_sebastian_coast', biom_type: 'coast', x: 16.3, y: 66, size: 4.8, deg: -1, zone: 4, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'San Sebastian', className: 'san_sebastian', biom_type: 'whool', x: 16.6, y: 67.5, size: 9, deg: -1, zone: 4, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'Toledo', className: 'toledo', biom_type: 'whool', x: 14.9, y: 72.4, size: 9.4, deg: -1, zone: 4, attackValue: 3, transX: 0, transY: 0, capitol: false },
			{ name: 'Valencia Küste', className: 'valencia_coast', biom_type: 'coast', x: 26.2, y: 75.3, size: 3.2, deg: 0, zone: 4, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Valencia', className: 'valencia', biom_type: 'silk', x: 22.3, y: 74.5, size: 5.4, deg: 0, zone: 4, attackValue: 2, transX: 0, transY: 0, capitol: false },
			// Zone 5
			{ name: 'Zone', className: 'zone5', biom_type: 'zone', x: 69.29, y: 21.69, size: 29.92, deg: -1, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Absgia Küste', className: 'absgia_coast', biom_type: 'coast', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Absgia', className: 'absgia', biom_type: 'supporter', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Angora Küste', className: 'angora_coast', biom_type: 'coast', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Angora', className: 'angora', biom_type: 'whool', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'Schwarzes Meer', className: 'black_sea', biom_type: 'sea', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Erzerum Küste', className: 'erzerum_coast', biom_type: 'coast', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Erzerum', className: 'erzerum', biom_type: 'silk', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 3, transX: 0, transY: 0, capitol: false },
			{ name: 'Kaffa Küste', className: 'kaffa_coast', biom_type: 'coast', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Kaffa', className: 'kaffa', biom_type: 'supporter', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Kamish', className: 'kamish', biom_type: 'supporter', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Kiew', className: 'kiev', biom_type: 'grain', x: 20.8, y: 73.9, size: 12.7, deg: 0, zone: 5, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'Poti Küste', className: 'poti_coast', biom_type: 'coast', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Poti', className: 'poti', biom_type: 'timber', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'Rebinzond Küste', className: 'rebinzond_coast', biom_type: 'coast', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Rebinzond', className: 'rebinzond', biom_type: 'spice', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Sarai', className: 'sarai', biom_type: 'gold', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'Tana Küste', className: 'tana_coast', biom_type: 'coast', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Tana', className: 'tana', biom_type: 'fur', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'Varna Küste', className: 'varna_coast', biom_type: 'coast', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Varna', className: 'varna', biom_type: 'fur', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 5, attackValue: 2, transX: 0, transY: 0, capitol: false },
			// Zone 6
			{ name: 'Zone', className: 'zone6', biom_type: 'zone', x: 68.17, y: 64.75, size: 27.35, deg: 0, zone: 6, attackValue: 0, transX: 0, transY: 0, capitol: false },
			// Zone 7
			{ name: 'Zone', className: 'zone7', biom_type: 'zone', x: 17, y: 47.87, size: 44.5, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Adria', className: 'adria', biom_type: 'sea', x: 45.6, y: 55.3, size: 12.2, deg: 0, zone: 7, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Bari Küste', className: 'bari_coast', biom_type: 'coast', x: 52.1, y: 62.5, size: 6.5, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Bari', className: 'bari', biom_type: 'supporter', x: 51.9, y: 63.5, size: 5.9, deg: 0, zone: 7, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Belgrad Küste', className: 'belgrad_coast', biom_type: 'coast', x: 56.1, y: 61, size: 2.9, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Belgrad', className: 'belgrad', biom_type: 'grain', x: 53.1, y: 48.4, size: 8.1, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Bordeaux Küste', className: 'bordeaux_coast', biom_type: 'coast', x: 17.4, y: 57.2, size: 4.9, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Bordeaux', className: 'bordeaux', biom_type: 'timber', x: 19, y: 55.1, size: 8.4, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Cagliori Küste', className: 'cagliori_coast', biom_type: 'coast', x: 37.2, y: 61.8, size: 7.9, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Cagliori', className: 'cagliori', biom_type: 'supporter', x: 37.5, y: 61.2, size: 5.4, deg: 0, zone: 7, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Dubrovnik Küste', className: 'dubrovnik_coast', biom_type: 'coast', x: 47.9, y: 53.4, size: 10.1, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Dubrovnik', className: 'dubrovnik', biom_type: 'timber', x: 47.8, y: 51.1, size: 10.3, deg: 0, zone: 7, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Firenze Küste', className: 'firenze_coast', biom_type: 'coast', x: 45.5, y: 57, size: 3.5, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Firenze', className: 'firenze', biom_type: 'cloth', x: 39.8, y: 55.6, size: 8.4, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Genoa Küste', className: 'genoa_coast', biom_type: 'coast', x: 37.89, y: 59, size: 6.6, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Genoa', className: 'genoa', biom_type: 'cloth', x: 36.3, y: 56.5, size: 8.6, deg: 0, zone: 7, attackValue: 5, transX: 0, transY: 0, capitol: true },
			{ name: 'Lyon', className: 'lyon', biom_type: 'metal', x: 26.5, y: 54.1, size: 11.4, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Marseille Küste', className: 'marseille_coast', biom_type: 'coast', x: 33.2, y: 62.3, size: 5.6, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Marseille', className: 'marseille', biom_type: 'wine', x: 32.9, y: 57.9, size: 5, deg: 0, zone: 7, attackValue: 5, transX: 0, transY: 0, capitol: false },
			{ name: 'Milano', className: 'milano', biom_type: 'stone', x: 36.2, y: 52.5, size: 5.3, deg: 0, zone: 7, attackValue: 5, transX: 0, transY: 0, capitol: false },
			{ name: 'Montpellier Küste', className: 'montpellier_coast', biom_type: 'coast', x: 29.6, y: 63.7, size: 3.7, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Montpellier', className: 'montpellier', biom_type: 'stone', x: 27, y: 58.6, size: 6.4, deg: 0, zone: 7, attackValue: 2, transX: 0, transY: 0, capitol: false },
			{ name: 'Napoli Küste Norden', className: 'napoli_coast_north', biom_type: 'coast', x: 49.7, y: 60.3, size: 2.5, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Napoli Küste Süden', className: 'napoli_coast_south', biom_type: 'coast', x: 46.3, y: 67, size: 6.8, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Napoli', className: 'napoli', biom_type: 'stone', x: 47.7, y: 63, size: 5.7, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Palermo Küste', className: 'palermo_coast', biom_type: 'coast', x: 47.4, y: 74.3, size: 7.8, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Palermo', className: 'palermo', biom_type: 'grain', x: 48.7, y: 76.5, size: 5.2, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Roma Küste Norden', className: 'roma_coast_north', biom_type: 'coast', x: 48.2, y: 59.4, size: 2.1, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Roma Küste Süden', className: 'roma_coast_south', biom_type: 'coast', x: 43.8, y: 64.3, size: 3.9, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Roma', className: 'roma', biom_type: 'stone', x: 43.8, y: 59.6, size: 5.9, deg: 0, zone: 7, attackValue: 4, transX: 0, transY: 0, capitol: false },
			{ name: 'Toulouse Küste', className: 'toulouse_coast', biom_type: 'coast', x: 17.6, y: 63.3, size: 3.9, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Toulouse', className: 'toulouse', biom_type: 'supporter', x: 21.2, y: 62.1, size: 8.4, deg: 0, zone: 7, attackValue: 1, transX: 0, transY: 0, capitol: false },
			{ name: 'Venezia Küste', className: 'venezia_coast', biom_type: 'coast', x: 43.7, y: 52.4, size: 4.3, deg: 0, zone: 7, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Venezia', className: 'venezia', biom_type: 'cloth', x: 40.9, y: 48.8, size: 7.2, deg: 0, zone: 7, attackValue: 5, transX: 0, transY: 0, capitol: true },
			// Zone 8
			{ name: 'Zone', className: 'zone8', biom_type: 'zone', x: 5.65, y: 55.86, size: 76.28, deg: 0, zone: 8, attackValue: 0, transX: 0, transY: 0, capitol: false },
			{ name: 'Fez', className: 'fez', biom_type: 'timber', x: 19.1, y: 92.8, size: 7.9, deg: 0, zone: 8, attackValue: 2, transX: 0, transY: 0, capitol: false },
			// Others
			{ name: 'Westliches Mittelmeer', className: 'westliches_mittelmeer', biom_type: 'sea', x: 23.8, y: 64, size: 29, deg: 0, zone: 0, attackValue: 0, transX: 0, transY: 0, capitol: false }
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
				regionData.transY,
				regionData.capitol
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
