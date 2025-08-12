// canvas.js - Herramientas avanzadas y stickers, con indicador de herramienta activa

document.addEventListener('DOMContentLoaded', function() {
    const paintCanvas = document.getElementById('paint-canvas');
    const ctx = paintCanvas.getContext('2d');

    // Estado local
    let drawing = false;
    let startX = 0, startY = 0, lastX = 0, lastY = 0;
    let currentTool = 'brush';
    let brushSize = 10;
    let brushColor = '#000000';
    let stickerImg = null;
    let tempCanvas = document.createElement('canvas');
    tempCanvas.width = paintCanvas.width;
    tempCanvas.height = paintCanvas.height;
    let tempCtx = tempCanvas.getContext('2d');

    // Herramientas UI (solo botones existentes)
    const toolBtns = [
        document.getElementById('tool-brush'),
        document.getElementById('tool-eraser'),
        document.getElementById('tool-line'),
        document.getElementById('tool-rect'),
        document.getElementById('tool-circle'),
        document.getElementById('tool-triangle')
    ].filter(Boolean);
    const stickerBtns = [
        document.getElementById('sticker-a'),
        document.getElementById('sticker-b'),
        document.getElementById('sticker-c')
    ].filter(Boolean);
    const sizeInput = document.getElementById('brush-size');
    const colorInput = document.getElementById('stroke-color');
    const fillInput = document.getElementById('fill-color');
    let fillColor = '#ffffff';
    if (fillInput) fillInput.addEventListener('input', e => fillColor = e.target.value);

    // Filtros
    const filterBtns = [
        document.getElementById('filter-gray'),
        document.getElementById('filter-negative'),
        document.getElementById('filter-red'),
        document.getElementById('filter-green'),
        document.getElementById('filter-blue'),
        document.getElementById('filter-none') // Nuevo botón para quitar filtro
    ].filter(Boolean);
    let currentFilter = null;

    // Herramientas: activar y resaltar
    toolBtns.forEach((btn, idx) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            currentTool = btn.dataset.tool;
            stickerImg = null;
            toolBtns.forEach(b => b.classList.remove('active-tool'));
            stickerBtns.forEach(b => b.classList.remove('active-tool'));
            btn.classList.add('active-tool');
            console.log('Herramienta seleccionada:', currentTool);
        });
    });
    // Stickers: seleccionar sticker
    stickerBtns.forEach((btn, idx) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            currentTool = 'sticker';
            stickerImg = new Image();
            stickerImg.src = btn.dataset.sticker;
            toolBtns.forEach(b => b.classList.remove('active-tool'));
            stickerBtns.forEach(b => b.classList.remove('active-tool'));
            btn.classList.add('active-tool');
            console.log('Sticker seleccionado:', btn.dataset.sticker);
        });
    });
    // Brocha y borrador por defecto
    if (toolBtns[0]) toolBtns[0].classList.add('active-tool');

    // Cambiar tamaño/color
    if (sizeInput) sizeInput.addEventListener('input', e => brushSize = parseInt(e.target.value));
    if (colorInput) colorInput.addEventListener('input', e => brushColor = e.target.value);

    // Filtros: aplicar filtro seleccionado
    filterBtns.forEach((btn, idx) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active-tool'));
            btn.classList.add('active-tool');
            switch(btn.id) {
                case 'filter-gray':
                    applyFilter('gray');
                    break;
                case 'filter-negative':
                    applyFilter('negative');
                    break;
                case 'filter-red':
                    applyFilter('red');
                    break;
                case 'filter-green':
                    applyFilter('green');
                    break;
                case 'filter-blue':
                    applyFilter('blue');
                    break;
                case 'filter-none':
                    applyFilter(null);
                    break;
                default:
                    applyFilter(null);
            }
        });
    });

    function applyFilter(type) {
        // Restaurar imagen original antes de aplicar filtro
        ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
        ctx.drawImage(tempCanvas, 0, 0);
        if (!type) {
            currentFilter = null;
            return;
        }
        let imageData = ctx.getImageData(0, 0, paintCanvas.width, paintCanvas.height);
        let data = imageData.data;
        switch(type) {
            case 'gray':
                for (let i = 0; i < data.length; i += 4) {
                    let avg = (data[i] + data[i+1] + data[i+2]) / 3;
                    data[i] = data[i+1] = data[i+2] = avg;
                }
                break;
            case 'negative':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i+1] = 255 - data[i+1];
                    data[i+2] = 255 - data[i+2];
                }
                break;
            case 'red':
                for (let i = 0; i < data.length; i += 4) {
                    data[i+1] = 0;
                    data[i+2] = 0;
                }
                break;
            case 'green':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 0;
                    data[i+2] = 0;
                }
                break;
            case 'blue':
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 0;
                    data[i+1] = 0;
                }
                break;
        }
        ctx.putImageData(imageData, 0, 0);
        currentFilter = type;
    }

    // updateTempCanvas: solo actualiza si no hay preview activo
    function updateTempCanvas() {
        tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
        tempCtx.drawImage(paintCanvas,0,0);
    }

    // Herramientas: activar y resaltar
    toolBtns.forEach((btn, idx) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            currentTool = btn.dataset.tool;
            stickerImg = null;
            toolBtns.forEach(b => b.classList.remove('active-tool'));
            stickerBtns.forEach(b => b.classList.remove('active-tool'));
            btn.classList.add('active-tool');
            console.log('Herramienta seleccionada:', currentTool);
        });
    });
    // Stickers: seleccionar sticker
    stickerBtns.forEach((btn, idx) => {
        if (!btn) return;
        btn.addEventListener('click', () => {
            currentTool = 'sticker';
            stickerImg = new Image();
            stickerImg.src = btn.dataset.sticker;
            toolBtns.forEach(b => b.classList.remove('active-tool'));
            stickerBtns.forEach(b => b.classList.remove('active-tool'));
            btn.classList.add('active-tool');
            console.log('Sticker seleccionado:', btn.dataset.sticker);
        });
    });
    // Brocha y borrador por defecto
    if (toolBtns[0]) toolBtns[0].classList.add('active-tool');

    // Cambiar tamaño/color
    if (sizeInput) sizeInput.addEventListener('input', e => brushSize = parseInt(e.target.value));
    if (colorInput) colorInput.addEventListener('input', e => brushColor = e.target.value);

    // Dibujo y figuras
    paintCanvas.addEventListener('mousedown', e => {
        const {x, y} = getPos(e);
        drawing = true;
        startX = lastX = x;
        startY = lastY = y;
        if (currentTool === 'sticker' && stickerImg) {
            ctx.drawImage(stickerImg, x - 32, y - 32, 64, 64);
            updateTempCanvas();
            if (currentFilter) applyFilter(currentFilter);
            drawing = false;
            console.log('Sticker colocado en:', x, y);
            return;
        }
        if (currentTool === 'brush' || currentTool === 'eraser') {
            drawLine(lastX, lastY, x, y);
            console.log('Inicio de trazo con', currentTool, 'en', x, y);
        } else if (["line","rect","circle","triangle"].includes(currentTool)) {
            // Guarda el estado actual del canvas para el preview
            tempCtx.clearRect(0,0,tempCanvas.width,tempCanvas.height);
            tempCtx.drawImage(paintCanvas,0,0);
            console.log('Inicio de figura', currentTool, 'en', x, y);
        }
    });
    paintCanvas.addEventListener('mousemove', e => {
        if (!drawing) return;
        const {x, y} = getPos(e);
        if (currentTool === 'brush' || currentTool === 'eraser') {
            drawLine(lastX, lastY, x, y);
            lastX = x; lastY = y;
        } else if (["line","rect","circle","triangle"].includes(currentTool)) {
            // Preview figura
            ctx.clearRect(0,0,paintCanvas.width,paintCanvas.height);
            ctx.drawImage(tempCanvas,0,0);
            drawShape(ctx, currentTool, startX, startY, x, y, true, true);
        }
    });
    paintCanvas.addEventListener('mouseup', e => {
        if (!drawing) return;
        drawing = false;
        const {x, y} = getPos(e);
        if (["line","rect","circle","triangle"].includes(currentTool)) {
            drawShape(ctx, currentTool, startX, startY, x, y, true, false);
            updateTempCanvas();
            if (currentFilter) applyFilter(currentFilter);
            console.log('Figura finalizada', currentTool, 'de', startX, startY, 'a', x, y);
        } else if (currentTool === 'brush' || currentTool === 'eraser') {
            updateTempCanvas();
            if (currentFilter) applyFilter(currentFilter);
        }
    });
    paintCanvas.addEventListener('mouseleave', () => drawing = false);

    function drawLine(x1, y1, x2, y2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = currentTool === 'eraser' ? '#fff' : brushColor;
        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
        ctx.stroke();
        ctx.restore();
    }

    function drawShape(context, tool, x1, y1, x2, y2, fill=false, preview=false) {
        context.save();
        context.beginPath();
        context.lineWidth = brushSize;
        context.strokeStyle = brushColor;
        context.globalCompositeOperation = 'source-over';
        switch(tool) {
            case 'line':
                context.moveTo(x1, y1);
                context.lineTo(x2, y2);
                break;
            case 'rect':
                context.rect(x1, y1, x2-x1, y2-y1);
                break;
            case 'circle': {
                const r = Math.hypot(x2-x1, y2-y1);
                context.arc(x1, y1, r, 0, 2*Math.PI);
                break;
            }
            case 'triangle':
                context.moveTo(x1, y2);
                context.lineTo((x1+x2)/2, y1);
                context.lineTo(x2, y2);
                context.closePath();
                break;
        }
        if (fill && tool !== 'line') {
            context.fillStyle = fillColor;
            context.globalAlpha = preview ? 0.4 : 1.0;
            context.fill();
        }
        if (fill) context.stroke();
        context.restore();
    }

    function getPos(e) {
        const rect = paintCanvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (paintCanvas.width / rect.width),
            y: (e.clientY - rect.top) * (paintCanvas.height / rect.height)
        };
    }
});
