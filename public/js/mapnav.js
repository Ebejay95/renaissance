document.addEventListener('DOMContentLoaded', function () {
    const mapWrapper = document.getElementById('mapwrap');
    const map = document.getElementById('map');
    let isDragging = false;
    let startX, startY;

    // Transformation-State
    let transform = {
        x: 0,
        y: 0,
        scale: 1
    };

    const updateTransform = () => {
        // Begrenzungen berechnen
        const rect = mapWrapper.getBoundingClientRect();
        const mapWidth = map.offsetWidth * transform.scale;
        const mapHeight = map.offsetHeight * transform.scale;

        const maxX = Math.max((rect.width - mapWidth) / 2, 0);
        const maxY = Math.max((rect.height - mapHeight) / 2, 0);

        const minX = rect.width - mapWidth - maxX;
        const minY = rect.height - mapHeight - maxY;

        // Position begrenzen
        transform.x = Math.min(Math.max(transform.x, minX), maxX);
        transform.y = Math.min(Math.max(transform.y, minY), maxY);

        map.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
    };

    // Mouse-down: Start des Dragging
    map.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - transform.x;
        startY = e.clientY - transform.y;
        map.style.cursor = 'grabbing';
    });

    // Mouse-move: Karte bewegen
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            transform.x = e.clientX - startX;
            transform.y = e.clientY - startY;
            updateTransform();
        }
    });

    // Mouse-up: Dragging beenden
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            map.style.cursor = 'grab';
        }
    });

    // Zoom-Funktionalität
    mapWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        // Mausposition relativ zur Karte
        const rect = mapWrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Zoom-Faktor (verringert/erhöht je nach Scroll-Richtung)
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

        // Neue Scale berechnen und begrenzen
        const newScale = Math.min(Math.max(transform.scale * zoomFactor, 0.5), 5);

        // Zoom-Position berechnen
        const scaleChange = newScale - transform.scale;
        transform.x -= (mouseX - transform.x) * (scaleChange / transform.scale);
        transform.y -= (mouseY - transform.y) * (scaleChange / transform.scale);
        transform.scale = newScale;

        updateTransform();
    }, { passive: false });

    // Initialer Cursor setzen
    map.style.cursor = 'grab';

    // Initiale Begrenzungen anwenden
    updateTransform();
});
