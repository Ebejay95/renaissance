const validateGameForm = () => {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('input[type="submit"]#new-game-submit');

    const updateSubmitButton = () => {
        const checkedFriends = form.querySelectorAll('input[name="friends"]:checked').length;
        const isValid = checkedFriends >= 2 && checkedFriends <= 5;

        submitButton.disabled = !isValid;

        let existingMessage = form.querySelector('.validation-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        if (!isValid) {
            const message = document.createElement('div');
            message.className = 'validation-message text-red-500 mt-2';
            message.textContent = checkedFriends < 2
                ? 'Bitte wählen Sie mindestens 2 Freunde aus.'
                : 'Maximal 5 Freunde können ausgewählt werden.';
            form.insertBefore(message, submitButton);
        }
    };

    const checkboxes = form.querySelectorAll('input[name="friends"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateSubmitButton);
    });

    updateSubmitButton();

    form.addEventListener('submit', (e) => {
        const checkedFriends = form.querySelectorAll('input[name="friends"]:checked').length;
        if (checkedFriends < 2 || checkedFriends > 5) {
            e.preventDefault();
        }
    });
};

document.addEventListener("DOMContentLoaded", () => {
    const triggers = document.querySelectorAll(".selective-interface-trigger");
    const interfaces = document.querySelectorAll(".selective-interface");
    const interfacesContainer = document.querySelector("#interfaces");

    triggers.forEach(trigger => {
        trigger.addEventListener("click", () => {
            const selectIf = trigger.getAttribute("data-select-if");

            if (trigger.classList.contains("active")) {
                deactivateAll();
            } else {
                deactivateAll();
                trigger.classList.add("active");
                const targetInterface = document.querySelector(`.selective-interface[data-select-if="${selectIf}"]`);
                if (targetInterface) {
                    targetInterface.classList.add("active");
                }
            }
            updateInterfacesContainer();
        });
    });

    function deactivateAll() {
        triggers.forEach(trigger => trigger.classList.remove("active"));
        interfaces.forEach(interfaceElement => interfaceElement.classList.remove("active"));
    }

    function updateInterfacesContainer() {
        if (Array.from(interfaces).some(interfaceElement => interfaceElement.classList.contains("active"))) {
            interfacesContainer.classList.add("active");
        } else {
            interfacesContainer.classList.remove("active");
        }
    }
});
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.throwdice').addEventListener('click', function() {
        document.querySelectorAll('.dice').forEach(dice => {
            document.querySelector('.throwdice').disabled = true;

            const finalValue = Math.floor(Math.random() * 6) + 1;

            const steps = 12;
            let currentStep = 0;

            const animate = () => {
                const tempValue = Math.floor(Math.random() * 6) + 1;
                dice.setAttribute('data-value', tempValue);

                currentStep++;

                if (currentStep < steps) {
                    const delay = 50 + (currentStep * 10);
                    setTimeout(animate, delay);
                } else {
                    dice.setAttribute('data-value', finalValue);
                    document.querySelector('.throwdice').disabled = false;
                }
            };
            animate();
        });
    });
});

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