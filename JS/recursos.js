// recursos.js
// Parámetros y acciones de herramientas y stickers

// No usar export para evitar error de importación en navegador
const TOOLS = {
    brush: {
        name: 'Brocha',
        icon: '../Recursos/Imagenes/Icon/pencil_icon.png',
        action: 'drawBrush'
    },
    eraser: {
        name: 'Borrador',
        icon: '../Recursos/Imagenes/Icon/erase_icon.png',
        action: 'drawEraser'
    },
    line: {
        name: 'Línea',
        icon: '../Recursos/Imagenes/Icon/line_icon.png',
        action: 'drawLine'
    },
    rect: {
        name: 'Cuadrado',
        icon: '../Recursos/Imagenes/Icon/square_icon.png',
        action: 'drawRect'
    },
    circle: {
        name: 'Círculo',
        icon: '../Recursos/Imagenes/Icon/circle_icon.png',
        action: 'drawCircle'
    },
    triangle: {
        name: 'Triángulo',
        icon: '../Recursos/Imagenes/Icon/triangle_icon.png',
        action: 'drawTriangle'
    },
    stickerA: {
        name: 'Luigi',
        icon: '../Recursos/Imagenes/Icon/luigi_icon.png',
        action: 'placeSticker',
        sticker: '../Recursos/Imagenes/Icon/luigi_icon.png'
    },
    stickerB: {
        name: 'Mario',
        icon: '../Recursos/Imagenes/Icon/mario_icon.png',
        action: 'placeSticker',
        sticker: '../Recursos/Imagenes/Icon/mario_icon.png'
    },
    stickerC: {
        name: 'Link',
        icon: '../Recursos/Imagenes/Icon/link_icon.png',
        action: 'placeSticker',
        sticker: '../Recursos/Imagenes/Icon/link_icon.png'
    }
};

// TODO: Definir valores por defecto de herramientas, pinceles, colores, stickers, etc.
