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