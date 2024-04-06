document.addEventListener('DOMContentLoaded', function() {
    let isDragging = false;
    let startX, startY;
    let lastX = 0, lastY = 0; // Speichert die letzte Position
    const map = document.getElementById('map');
    let zoomLevel = 1;
    const zoomSpeed = 0.05; // Verlangsamt den Zoom
    const maxZoom = 2; // Maximaler Zoom
    const minZoom = 0.8; // Minimaler Zoom

    map.addEventListener('mousedown', (e) => {
        isDragging = true;
        // Korrigiere hier, berücksichtige den aktuellen Scale für die Startposition
        startX = (e.pageX - map.offsetLeft - lastX) / zoomLevel;
        startY = (e.pageY - map.offsetTop - lastY) / zoomLevel;
        map.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            // Anpassung der Berechnung unter Berücksichtigung des aktuellen Zoomlevels
            const x = (e.pageX - map.offsetLeft - startX) * zoomLevel;
            const y = (e.pageY - map.offsetTop - startY) * zoomLevel;
            updateTransform(x / zoomLevel, y / zoomLevel); // Anwendung der Transformation ohne zusätzliche Skalierung
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            map.style.cursor = 'grab';
        }
    });

    function updateTransform(x, y) {
        lastX = x; // Aktualisiere lastX und lastY hier, um den neuesten Stand zu speichern
        lastY = y;
        map.style.transform = `translate(${x}px, ${y}px) scale(${zoomLevel})`;
    }

    function zoomIn() {
        if (zoomLevel < maxZoom) {
            zoomLevel += zoomSpeed;
            updateTransform(lastX, lastY);
        }
    }

    function zoomOut() {
        if (zoomLevel > minZoom) {
            zoomLevel -= zoomSpeed;
            updateTransform(lastX, lastY);
        }
    }

    function updateTransform(x, y) {
        map.style.transform = `translate(${x}px, ${y}px) scale(${zoomLevel})`;
    }

    // Button-Event-Listener
    document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
    document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);

    // Mausrad-Event für Zoom
    document.getElementById('map').addEventListener('wheel', (event) => {
        event.preventDefault(); // Verhindert das Scrollen der ganzen Seite
        const rect = map.getBoundingClientRect();
        const mouseX = event.clientX - rect.left; // Mausposition X relativ zum Element
        const mouseY = event.clientY - rect.top; // Mausposition Y relativ zum Element

        const scaleFactor = (event.deltaY < 0) ? (1 + zoomSpeed) : (1 - zoomSpeed);
        const newZoomLevel = zoomLevel * scaleFactor;

        if (newZoomLevel >= minZoom && newZoomLevel <= maxZoom) {
            zoomLevel = newZoomLevel;
            // Berechnung für zentriertes Zoomen
            const newLastX = mouseX * (1 - scaleFactor) + lastX * scaleFactor;
            const newLastY = mouseY * (1 - scaleFactor) + lastY * scaleFactor;
            lastX = newLastX;
            lastY = newLastY;
            updateTransform(newLastX, newLastY);
        }
    });
});