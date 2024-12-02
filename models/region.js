const mongoose = require('mongoose');

const fs = require('fs');
const path = require('path');
const Biom = require('./biom');
const BiomController = require('../controllers/biom');

const Schema = mongoose.Schema;

const regionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    svgPath: {
        type: String
    },
    x: Number,
    y: Number,
    deg: Number,
    size: Number,
    zone: Number,
    attackValue: Number,
	transX: {
		type: Number,
		default: 0
	},
	transY: {
		type: Number,
		default: 0
	},
    coasts: [{
        type: Schema.Types.ObjectId,
        ref: 'Region'
    }],
    adjacentRegions: [{
        type: Schema.Types.ObjectId,
        ref: 'Region'
    }],
    supportedRegions: [{
        type: Schema.Types.ObjectId,
        ref: 'Region'
    }],
    biom: {
        type: Schema.Types.ObjectId,
        ref: 'Biom'
    },
    game: {
        type: Schema.Types.ObjectId,
        ref: 'Game'
    }
});

regionSchema.methods.updateSVG = async function() {
    try {
		let transferX = ((50) + this.transX)
		let transferY = ((50) + this.transY)
		console.log(this.name, ' ', this.transX, ' ', this.transY, ' - ', transferX, ' ', transferY)
        const svgPath = path.join(__dirname, '../public/svgs/', this.className + '.svg');
        const svgText = await fs.promises.readFile(svgPath, 'utf8'); 
        const svgStyleStr = `style="width: 100%;"`;
        const divStyleStr = `id="${this.className}" class="region" data-biom="${this.biom.className}" data-zone="${this.zone}" data-attackValue="${this.attackValue}" style="width: ${this.size}%; left: ${this.x}%; top: ${this.y}%;transform: rotate(${this.deg}deg);"`;
        const pathStr = `fill="${this.biom.color}"`;
        const regionInterface = `<div class="region-interface" style="transform: translate(-${transferX}%, -${transferY}%);"><div class="region-title">${this.name}</div><div class="region-attack-value">${this.attackValue}</div><div class="full-troop-container"></div><div class="partial-troop-container"></div></div>`;
        let updatedSvgText = svgText.replace(/<svg /, `<svg ${svgStyleStr} `);
		updatedSvgText = updatedSvgText.replace('fill="none"', pathStr);
		const divText = `<div ${divStyleStr}><div class="region-wrap">${regionInterface}${updatedSvgText}</div></div>`
        this.svgPath = divText;
        await this.save();
    } catch (err) {
        console.error("Fehler beim Lesen der Datei:", err);
    }
};

regionSchema.methods.addCoast = async function(name, x, y, size, deg) {
    const coast = new Region({
        name: name,
        className: name,
        svgPath: '',
        x: x,
        y: y,
        deg: deg,
        size: size,
        zone: 0,
        attackValue: 0,
        coasts: [],
        adjacentRegions: [],
        supportedRegions: [],
        biom: await BiomController.biomIDByName(this.game, 'coast'),
        game: this.game
    });

    await coast.updateSVG();
    await coast.save();
    this.coasts.push(coast);
    await this.save();
};
regionSchema.methods.supports = function(supportedRegion) {
    this.supportedRegions.push(supportedRegion);
    this.save();
};
regionSchema.methods.nextTo = function(nextToRegion) {
    this.adjacentRegions.push(nextToRegion);
    this.save();
};

const Region = mongoose.models.Region || mongoose.model('Region', regionSchema)
module.exports = Region;