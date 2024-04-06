document.addEventListener('DOMContentLoaded', function(){
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
        startX = e.pageX - map.offsetLeft - lastX;
        startY = e.pageY - map.offsetTop - lastY;
        map.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.pageX - startX;
            const y = e.pageY - startY;
            lastX = x; // Aktualisiert die letzte bekannte Position
            lastY = y;
            updateTransform(x, y);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            map.style.cursor = 'grab';
        }
    });

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