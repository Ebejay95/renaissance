const Progress = require('../models/progress');
const ProgressController = require('../controllers/progress');

exports.createProgresses = async (game_id) => {
    const progressData = [
        { letter: "A", name: "Sternenkunde", desciption:"Ermöglicht die Überquerung eriners Meerfeldes als ob es sich um eine Küstenregion handelt. Veringert die Auswirkung von Mystizismus.", cost: 30, discount: 20, group: "Wissenschaft", dependencies: [], effects: ["reduceMystic", "crossOneSea"], game: game_id },
        { letter: "B", name: "Anatomie", description: "Verringert den Elendsindex um eine Stufe. Veringert die Auswirkung von Mystizismus.", cost: 60, discount: 20, group: "Wissenschaft", dependencies: [], effects: ["discMisery", "reduceMystic"], game: game_id },
        { letter: "C", name: "Materialkunde", description: "Hebt die Auswirkung von Alchimie auf. Veringert die Auswirkung von Mystizismus.", cost: 90, discount: 20, group: "Wissenschaft", dependencies: [], effects: ["blockAlchimy", "reduceMystic"], game: game_id },
        { letter: "D", name: "Materialkunde",  description: "In der Einkommensphase wird der Elensindex um eine Stufe verbessert. Veringert die Auswirkung von Mystizismus.", cost: 120, discount: 20, group: "Wissenschaft", dependencies: [], effects: ["discMiseryLoop", "reduceMystic"], game: game_id },
        { letter: "E", name: "Patronatsrecht", description: "Erlaubt die Nutzung von Nachlässen der durch andere Spieler ausgespielten Persönlichkeiten", cost: 30, discount: 20, group: "Religion", dependencies: [], effects: ["patronat"], game: game_id },
        { letter: "F", name: "Heilige Absolution", description: "Erhält zu Beginn der Expansionsphase von jedem Spieler der diesen Fortschritt nicht besitzt 2 Truppen.", cost: 60, discount: 20, group: "Religion", dependencies: [], effects: ["holyAbsolution"], game: game_id },
        { letter: "G", name: "Gottvertrauen", description: "Ein Angriff gelint wernn das Ergebnis des grünen Würfels >= als die aktuelle Position des Spielers ist.", cost: 90, discount: 20, group: "Religion", dependencies: [], effects: ["trustInGod"], game: game_id },
        { letter: "G", name: "Kathedrale", description: "Gewinnt automatisch einen Kampf pro Runde gegen einen Nichtbesitzer", cost: 120, discount: 20, group: "Religion", dependencies: ["F"], effects: ["cathedral"], game: game_id },
        { letter: "I", name: "Karawane", description: "Ermöglicht die Platzierung eigener Truppen(rund) durch eine angrenzende unkontrollierte Region.", cost: 20, discount: 10, group: "Handel", dependencies: [], effects: ["caravan"], game: game_id },
        { letter: "J", name: "Mühlen", description: "Ermöglicht die Veränderung von Mangel/Überfluss mancher Handelswaren um eine Stufe.", cost: 40, discount: 10, group: "Handel", dependencies: ["I"], effects: ["mills"], game: game_id },
        { letter: "K", name: "Landwirtschaft", description: "Verringert Eleendsindex um eine Stufe. Verringert Auswirkung von Hungersnot.", cost: 50, discount: 10, group: "Handel", dependencies: ["J"], effects: ["discMisery", "reduceFamine"], game: game_id },
        { letter: "L", name: "Bankwesen", description: "I n der Einkommensphase wird das vorhandene Bargeld verdoppelt.", cost: 80, discount: 10, group: "Handel", dependencies: ["K"], effects: ["banking"], game: game_id },
        { letter: "M", name: "Manufakturen", description: "Erhöht die Auszahlung von Handelswaren um eine Stufe.", cost: 110, discount: 0, group: "Handel", dependencies: ["L"], effects: ["manufacturing"], game: game_id },
        { letter: "N", name: "Schriftliche Aufzeichnungen", description: "Ermöglicht in der Expansionsphase den Versuch mit einem Speieler, dem man eine Provinz abgenommen hat, der diesen Fortschritt nicht hat, eine Karte zu tauschen.", cost: 30, discount: 30, group: "Kultur", dependencies: [], effects: ["scripture"], game: game_id },
        { letter: "O", name: "Buchdruck", description: "Gestattet nachträgliche Zahlung von Nachlässen durch Persönlichkeiten für bereits erworbene Fortschritte.", cost: 60, discount: 20, group: "Kultur", dependencies: ["N"], effects: ["press"], game: game_id },
        { letter: "P", name: "Kunst & Technik", description: "Ermöglicht das Ablegen einer Karte am Ende der Phase 'Karten spielen'.", cost: 90, discount: 10, group: "Kultur", dependencies: ["O"], effects: ["artsAndTechnology"], game: game_id },
        { letter: "Q", name: "Renaissance", description: "Mit einem benachbarten Nichtbesitze kann die Position eingetauscht werden.", cost: 120, discount: 0, group: "Kultur", dependencies: ["P"], effects: ["renaissace"], game: game_id },
        { letter: "R", name: "Seidenstrasse", description: "Ermöglicht in der Expansionsphase Region V (Seidenstrasse) zu betreten.", cost: 40, discount: 20, group: "Entdeckungen", dependencies: [], effects: ["silkRoad"], game: game_id },
        { letter: "S", name: "Dreimaster", description: "Ermöglicht in der Expansionsphase alle Küstenprovinzen mit Ausnahme des Orients und der neuen Welt zu betreten.", cost: 80, discount: 20, group: "Entdeckungen", dependencies: [], effects: ["three-master"], game: game_id },
        { letter: "T", name: "Hochseenavigation", description: "Erlaubt Expansion nach Fernost.", cost: 120, discount: 20, group: "Entdeckungen", dependencies: ["A", "S"], effects: ["oceanNavigation"], game: game_id },
        { letter: "U", name: "Neue Welt", description: "Ermöglicht Expansion in die neue Welt.", cost: 160, discount: 0, group: "Entdeckungen", dependencies: ["V", "T"], effects: ["newWorld"], game: game_id },
        { letter: "V", name: "Städtevorherrschaft", description: "Ermöglicht den Erwerb einer zusätzlichen Karte für 10 Dukaten.", cost: 20, discount: 20, group: "Gesellschaft", dependencies: [], effects: ["cityDominance"], game: game_id },
        { letter: "W", name: "Nationalismus", description: "In der Heimatregion ist die eigene Streitmacht um 1 stärker, wenn um die Kontrolle einer Provinz gefochten wird.", cost: 60, discount: 30, group: "Gesellschaft", dependencies: [], effects: ["nationalism"], game: game_id },
        { letter: "X", name: "Institutsforschung", description: "Gibt einen zusätzlichen Nachlaß von 10 Dukaten bei jedem Erwerb eines Fortschritts außer in den Bereichen Religion und Gesellschaft.", cost: 100, discount: 40, group: "Gesellschaft", dependencies: [], effects: ["institute"], game: game_id },
        { letter: "Y", name: "Weltbürgertum", description: "Ein Satellit unterstützt den Spieler in Verteidigung UND Angriff und erhöht die Stärke um 1.", cost: 150, discount: 50, group: "Gesellschaft", dependencies: ["R"], effects: ["satellite"], game: game_id },
        { letter: "Z", name: "Mittelstand", description: "Halbiert die Kosten für Stabilisierung und erhöht das Einkommen um 10 Dukaten pro Runde.", cost: 170, discount: 60, group: "Gesellschaft", dependencies: ["K"], effects: ["middleClass"], game: game_id },

    ];

    try {
        await Promise.all(progressData.map(progressData => new Progress(progressData).save()));
    } catch (err) {
        console.error('Fehler beim Erstellen der Progresses:', err);
    }
};

exports.getProgresses = async (game_id) => {
    try {
        const progresses = await Progress.find({ 
            game: game_id
        }).sort({ 'letter': 1 });
        return progresses.length ? progresses : null;
    } catch (err) {
        console.error('Fehler beim Abrufen der Progress:', err);
        return null;
    }
};

exports.getGroupedProgresses = async (game_id) => {
    try {
        const progresses = await Progress.find({ game: game_id }).sort({ letter: 1 });

        if (!progresses.length) {
            return {};
        }

        const groupedProgresses = progresses.reduce((grouped, progress) => {
            if (!grouped[progress.group]) {
                grouped[progress.group] = [];
            }
            grouped[progress.group].push(progress);
            return grouped;
        }, {});

        return groupedProgresses;
    } catch (err) {
        console.error('Fehler beim Abrufen der gruppierten Progresses:', err);
        return {};
    }
};



exports.deleteProgresses = (game_id) => {
    return Progress.deleteMany({ game: game_id })
        .then(deletionResult => {
            if (deletionResult.deletedCount > 0) {
                return true;
            } else {
                console.log('Keine Progresses zum Löschen gefunden.');
                return false; 
            }
        })
        .catch(err => {
            console.error('Fehler beim Löschen der Progresses:', err);
            throw err;
        });
};

exports.deleteProgressesByGameId = async (gameId) => {
    return await Progress.deleteMany({ game: gameId });
};