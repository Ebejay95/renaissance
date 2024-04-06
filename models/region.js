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
        const svgPath = path.join(__dirname, '../public/svgs/', this.className + '.svg');
        const svgText = await fs.promises.readFile(svgPath, 'utf8'); 
        const styleStr = `id="${this.className}" data-biom="${this.biom.className}" style="width: ${this.size}%; left: ${this.x}%; top: ${this.y}%;transform: rotate(${this.deg}deg);"`;
        const pathStr = `fill="${this.biom.color}"`;
        let updatedSvgText = svgText.replace(/<svg /, `<svg ${styleStr} `);
		updatedSvgText = updatedSvgText.replace('fill="none"', pathStr);
        this.svgPath = updatedSvgText;
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