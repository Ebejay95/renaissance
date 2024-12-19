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
