
document.addEventListener('DOMContentLoaded', () => {
    const regionInterfaces = document.querySelectorAll('.region-interface');

    // Hilfsfunktion um die Gesamtanzahl der Truppen in einer Region zu berechnen
    const getTotalTroops = (interface) => {
        const cities = ['venice', 'paris', 'genoa', 'hamburg', 'barcelona', 'london'];
        return cities.reduce((sum, city) => sum + (parseInt(interface.dataset[city] || '0')), 0);
    };

    // Hilfsfunktion um zu prüfen ob ein Land bereits vollen Besitz hat
    const hasFullOwnership = (interface) => {
        const attackValue = parseInt(interface.dataset.attackValue);
        const cities = ['venice', 'paris', 'genoa', 'hamburg', 'barcelona', 'london'];
        return cities.some(city => parseInt(interface.dataset[city] || '0') === attackValue);
    };

    document.querySelectorAll('.button').forEach(button => {
        button.addEventListener('click', () => {
            const cityName = button.dataset.name;

            regionInterfaces.forEach(interface => {
                const attackValue = parseInt(interface.dataset.attackValue);
                const currentCityValue = parseInt(interface.dataset[cityName] || '0');
                const totalTroops = getTotalTroops(interface);

                // Prüfen ob weitere Truppen hinzugefügt werden können
                if (
                    // Gesamtanzahl der Truppen muss unter dem attack-value bleiben
                    totalTroops < attackValue &&
                    // Der neue Wert für die Stadt darf nicht den attack-value übersteigen
                    currentCityValue + 1 <= attackValue &&
                    // Kein Land darf bereits vollen Besitz haben
                    !hasFullOwnership(interface)
                ) {
                    interface.dataset[cityName] = currentCityValue + 1;
                }
            });
        });
    });
});