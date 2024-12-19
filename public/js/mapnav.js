class PanZoomHandler {
    constructor(wrapperElement, mapElement, options = {}) {
        this.wrapper = wrapperElement;
        this.element = mapElement;
        this.options = {
            topOffset: options.topOffset || 60,
            bottomOffset: options.bottomOffset || 340,
            maxScale: options.maxScale || 5,
            zoomSensitivity: options.zoomSensitivity || 0.0005,
            dampingFactor: options.dampingFactor || 0.8,
            ...options
        };

        // Transform state
        this.transform = {
            x: 100,
            y: 100,
            scale: 0.20
        };

        // Dragging state
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;

        // Bind methods
        this.handleWheel = this.handleWheel.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.init();
    }

    calculateMinScale() {
        const wrapperRect = this.wrapper.getBoundingClientRect();
        const mapRect = this.element.getBoundingClientRect();
        const availableHeight = wrapperRect.height - this.options.topOffset - this.options.bottomOffset;

        const scaleHeight = availableHeight / (mapRect.height / this.transform.scale);
        const scaleWidth = wrapperRect.width / (mapRect.width / this.transform.scale);

        return Math.min(scaleHeight, scaleWidth);
    }

    constrainPosition() {
        const wrapperRect = this.wrapper.getBoundingClientRect();
        const mapRect = this.element.getBoundingClientRect();
        const availableHeight = wrapperRect.height - this.options.topOffset - this.options.bottomOffset;

        // Update minimum scale
        const minScale = this.calculateMinScale();
        this.transform.scale = Math.max(this.transform.scale, minScale);

        // Calculate scaled dimensions
        const scaledHeight = mapRect.height;

        // Horizontal constraints
        if (mapRect.width < wrapperRect.width) {
            this.transform.x = (wrapperRect.width - mapRect.width) / 2;
        } else {
            const minX = wrapperRect.width - mapRect.width;
            this.transform.x = Math.min(0, Math.max(this.transform.x, minX));
        }

        // Vertical constraints
        if (scaledHeight <= availableHeight) {
            this.transform.y = this.options.topOffset + (availableHeight - scaledHeight) / 2;
        } else {
            const minY = wrapperRect.height - scaledHeight - this.options.bottomOffset;
            this.transform.y = Math.min(this.options.topOffset, Math.max(this.transform.y, minY));
        }
    }

    updateTransform() {
        this.constrainPosition();
        this.element.style.transform = `translate(${this.transform.x}px, ${this.transform.y}px) scale(${this.transform.scale})`;
    }

    handleWheel(e) {
        e.preventDefault();

        const zoomDelta = -e.deltaY * this.options.zoomSensitivity;
        const rect = this.wrapper.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Smooth zoom calculation
        const zoomFactor = Math.exp(zoomDelta);
        const minScale = this.calculateMinScale();
        let newScale = this.transform.scale * zoomFactor;

        // Soft limits at extremes
        if (newScale < minScale) {
            newScale = minScale + (newScale - minScale) * 0.1;
        } else if (newScale > this.options.maxScale) {
            newScale = this.options.maxScale - (this.options.maxScale - newScale) * 0.1;
        }

        // Calculate position with damping
        const scaleChange = newScale - this.transform.scale;
        this.transform.x -= (mouseX - this.transform.x) * (scaleChange / this.transform.scale) * this.options.dampingFactor;
        this.transform.y -= (mouseY - this.transform.y) * (scaleChange / this.transform.scale) * this.options.dampingFactor;
        this.transform.scale = newScale;

        this.updateTransform();
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.startX = e.clientX - this.transform.x;
        this.startY = e.clientY - this.transform.y;
        this.element.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;

        this.transform.x = e.clientX - this.startX;
        this.transform.y = e.clientY - this.startY;
        this.updateTransform();
    }

    handleMouseUp() {
        if (this.isDragging) {
            this.isDragging = false;
            this.element.style.cursor = 'grab';
        }
    }

    init() {
        this.wrapper.addEventListener('wheel', this.handleWheel, { passive: false });
        this.element.addEventListener('mousedown', this.handleMouseDown);
        document.addEventListener('mousemove', this.handleMouseMove);
        document.addEventListener('mouseup', this.handleMouseUp);
        window.addEventListener('resize', this.handleResize);

        // Set initial state
        this.element.style.cursor = 'grab';
        this.updateTransform();
    }

    handleResize() {
        this.updateTransform();
    }

    destroy() {
        this.wrapper.removeEventListener('wheel', this.handleWheel);
        this.element.removeEventListener('mousedown', this.handleMouseDown);
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
        window.removeEventListener('resize', this.handleResize);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const mapWrapper = document.getElementById('mapwrap');
    const map = document.getElementById('map');

    const panZoom = new PanZoomHandler(mapWrapper, map);
});