const property = require('../models/property');
const PropertyController = require('../controllers/property');

exports.createpropertys = async (game_id) => {
    const propertyData = [
        { index: 0, val_3: 15, val_4: 15, val_5: 15, val_6: 15, game: game_id },
        { index: 1, val_3: 18, val_4: 19, val_5: 20, val_6: 21, game: game_id },
        { index: 2, val_3: 21, val_4: 23, val_5: 25, val_6: 27, game: game_id },
        { index: 3, val_3: 24, val_4: 27, val_5: 30, val_6: 33, game: game_id },
        { index: 4, val_3: 27, val_4: 31, val_5: 35, val_6: 39, game: game_id },
        { index: 5, val_3: 30, val_4: 35, val_5: 40, val_6: 45, game: game_id },
        { index: 6, val_3: 33, val_4: 39, val_5: 45, val_6: 51, game: game_id },
        { index: 7, val_3: 36, val_4: 43, val_5: 50, val_6: 57, game: game_id },
        { index: 8, val_3: 39, val_4: 47, val_5: 55, val_6: 63, game: game_id },
        { index: 9, val_3: 42, val_4: 51, val_5: 60, val_6: 69, game: game_id },
        { index: 10, val_3: 45, val_4: 55, val_5: 65, val_6: 75, game: game_id },
        { index: 11, val_3: 48, val_4: 59, val_5: 70, val_6: 81, game: game_id },
        { index: 12, val_3: 51, val_4: 63, val_5: 75, val_6: 87, game: game_id },
        { index: 13, val_3: 54, val_4: 67, val_5: 80, val_6: 93, game: game_id },
        { index: 14, val_3: 57, val_4: 71, val_5: 85, val_6: 99, game: game_id },
        { index: 15, val_3: 60, val_4: 75, val_5: 90, val_6: 105, game: game_id },
        { index: 16, val_3: 63, val_4: 79, val_5: 95, val_6: 111, game: game_id },
        { index: 17, val_3: 66, val_4: 83, val_5: 100, val_6: 117, game: game_id },
        { index: 18, val_3: 69, val_4: 87, val_5: 105, val_6: 123, game: game_id },
        { index: 19, val_3: 72, val_4: 91, val_5: 110, val_6: 129, game: game_id },
        { index: 20, val_3: 75, val_4: 95, val_5: 115, val_6: 135, game: game_id },
        { index: 21, val_3: 78, val_4: 99, val_5: 120, val_6: 141, game: game_id },
        { index: 22, val_3: 81, val_4: 103, val_5: 125, val_6: 147, game: game_id },
        { index: 23, val_3: 84, val_4: 107, val_5: 130, val_6: 153, game: game_id },
        { index: 24, val_3: 87, val_4: 111, val_5: 135, val_6: 159, game: game_id },
        { index: 25, val_3: 90, val_4: 115, val_5: 140, val_6: 165, game: game_id }
    ];

    try {
        await Promise.all(propertyData.map(propertyData => new property(propertyData).save()));
    } catch (err) {
        console.error('Fehler beim Erstellen der propertys:', err);
    }
};

exports.getpropertys = async (game_id) => {
    try {
        const propertys = await property.find({ 
            game: game_id
        }).sort({ 'index': 1 });
        return propertys.length ? propertys : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der propertys:', err);
        return null;
    }
};

exports.deletepropertys = (game_id) => {
    return propertys.deleteMany({ game: game_id })
        .then(deletionResult => {
            if (deletionResult.deletedCount > 0) {
                return true;
            } else {
                console.log('Keine propertys zum Löschen gefunden.');
                return false; 
            }
        })
        .catch(err => {
            console.error('Fehler beim Löschen der propertys:', err);
            throw err;
        });
};

exports.deletepropertysByGameId = async (gameId) => {
    return await property.deleteMany({ game: gameId });
};