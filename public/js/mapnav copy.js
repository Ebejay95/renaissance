document.addEventListener('DOMContentLoaded', function() {
    let isDragging = false;
    let startX, startY;
    let lastX = 0, lastY = 0;
    const map = document.getElementById('map');
    let zoomLevel = 1;
    const zoomSpeed = 0.05;
    const maxZoom = 2;
    const minZoom = 0.8;

    map.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = (e.pageX - map.offsetLeft - lastX) / zoomLevel;
        startY = (e.pageY - map.offsetTop - lastY) / zoomLevel;
        map.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = (e.pageX - map.offsetLeft - startX) * zoomLevel;
            const y = (e.pageY - map.offsetTop - startY) * zoomLevel;
            updateTransform(x / zoomLevel, y / zoomLevel);
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            map.style.cursor = 'grab';
        }
    });

    function updateTransform(x, y) {
        lastX = x;
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

    document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
    document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);

    document.getElementById('map').addEventListener('wheel', (event) => {
        event.preventDefault();
        const rect = map.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const scaleFactor = (event.deltaY < 0) ? (1 + zoomSpeed) : (1 - zoomSpeed);
        const newZoomLevel = zoomLevel * scaleFactor;

        if (newZoomLevel >= minZoom && newZoomLevel <= maxZoom) {
            zoomLevel = newZoomLevel;
            const newLastX = mouseX * (1 - scaleFactor) + lastX * scaleFactor;
            const newLastY = mouseY * (1 - scaleFactor) + lastY * scaleFactor;
            lastX = newLastX;
            lastY = newLastY;
            updateTransform(newLastX, newLastY);
        }
    });
});