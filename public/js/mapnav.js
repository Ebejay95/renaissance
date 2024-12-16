document.addEventListener('DOMContentLoaded', function () {
    const mapWrapper = document.getElementById('mapwrap');
    const map = document.getElementById('map');
    let isDragging = false;
    let startX, startY;
    
    let transform = {
        x: 100,
        y: 100,
        scale: 0.20
    };

    const calculateMinScale = () => {
        const wrapperRect = mapWrapper.getBoundingClientRect();
        const mapRect = map.getBoundingClientRect();
        const topOffset = 60;
        const bottomOffset = 340;
        const availableHeight = wrapperRect.height - topOffset - bottomOffset;
        
        // Berechne die minimale Skalierung, damit die Karte in den verfügbaren Bereich passt
        const scaleHeight = availableHeight / (mapRect.height / transform.scale);
        const scaleWidth = wrapperRect.width / (mapRect.width / transform.scale);
        
        return Math.min(scaleHeight, scaleWidth);
    };

    const constrainPosition = () => {
        const wrapperRect = mapWrapper.getBoundingClientRect();
        const mapRect = map.getBoundingClientRect();
        const topOffset = 60;
        const bottomOffset = 340;
        
        // Aktualisiere die minimale Skalierung
        const minScale = calculateMinScale();
        transform.scale = Math.max(transform.scale, minScale);
        
        // Berechne die tatsächliche Höhe der skalierten Karte
        const scaledHeight = mapRect.height;
        const availableHeight = wrapperRect.height - topOffset - bottomOffset;
        
        // Horizontale Positionierung
        if (mapRect.width < wrapperRect.width) {
            transform.x = (wrapperRect.width - mapRect.width) / 2;
        } else {
            const minX = wrapperRect.width - mapRect.width;
            transform.x = Math.min(0, Math.max(transform.x, minX));
        }
        
        // Vertikale Positionierung
        if (scaledHeight <= availableHeight) {
            // Wenn die Karte kleiner ist als der verfügbare Raum, zentriere sie
            transform.y = topOffset + (availableHeight - scaledHeight) / 2;
        } else {
            // Wenn die Karte größer ist, begrenze die Position
            const minY = wrapperRect.height - scaledHeight - bottomOffset;
            transform.y = Math.min(topOffset, Math.max(transform.y, minY));
        }
    };

    const updateTransform = () => {
        constrainPosition();
        map.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
    };

    map.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - transform.x;
        startY = e.clientY - transform.y;
        map.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            transform.x = e.clientX - startX;
            transform.y = e.clientY - startY;
            updateTransform();
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            map.style.cursor = 'grab';
        }
    });

    mapWrapper.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        const rect = mapWrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        const minScale = calculateMinScale();
        const newScale = Math.min(Math.max(transform.scale * zoomFactor, minScale), 5);
        
        const scaleChange = newScale - transform.scale;
        transform.x -= (mouseX - transform.x) * (scaleChange / transform.scale);
        transform.y -= (mouseY - transform.y) * (scaleChange / transform.scale);
        transform.scale = newScale;
        
        updateTransform();
    }, { passive: false });

    // Initialer Update
    updateTransform();
    map.style.cursor = 'grab';

    // Füge einen Event Listener für Fenstergrößenänderungen hinzu
    window.addEventListener('resize', updateTransform);
});