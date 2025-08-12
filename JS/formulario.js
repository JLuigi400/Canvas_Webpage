// formulario.js
// Lógica para preview de imagen, drag & drop de imágenes al canvas
// (Implementación detallada a agregar)

// Lógica para cargar imagen de referencia y mostrar preview
let imgUpload = document.getElementById('img-upload');
let imgUploadBtn = document.getElementById('img-upload-btn');
let imgPreview = document.getElementById('img-preview');
let addDraggableBtn = document.getElementById('add-draggable-btn');
let draggableImages = document.getElementById('draggable-images');

if (imgUploadBtn && imgUpload) {
    imgUploadBtn.addEventListener('click', () => imgUpload.click());
    imgUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                // Preview solo muestra la imagen, no es draggable
                imgPreview.innerHTML = `<img src="${evt.target.result}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="Preview" draggable="false">`;
            };
            reader.readAsDataURL(file);
        } else {
            imgPreview.innerHTML = '';
        }
    });
}

// Drag and drop: cargar imagen arrastrable
if (addDraggableBtn && draggableImages) {
    // Crear input file oculto para drag and drop
    let dragInput = document.createElement('input');
    dragInput.type = 'file';
    dragInput.accept = 'image/*';
    dragInput.style.display = 'none';
    document.body.appendChild(dragInput);

    addDraggableBtn.addEventListener('click', () => dragInput.click());
    dragInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(evt) {
                // Crear imagen arrastrable
                const img = document.createElement('img');
                img.src = evt.target.result;
                img.style.maxWidth = '100%';
                img.style.maxHeight = '100%';
                img.style.objectFit = 'contain';
                img.setAttribute('draggable', 'true');
                img.style.cursor = 'grab';
                img.ondragstart = function(ev) {
                    ev.dataTransfer.setData('text/plain', img.src);
                };
                draggableImages.innerHTML = '';
                draggableImages.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
}

// Eliminar declaración global de paintCanvas y ctx, usar solo dentro de funciones
document.addEventListener('DOMContentLoaded', function() {
    var paintCanvas = document.getElementById('paint-canvas');
    if (paintCanvas) {
        paintCanvas.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        paintCanvas.addEventListener('drop', function(e) {
            e.preventDefault();
            var files = e.dataTransfer.files;
            if (files.length > 0) {
                var reader = new FileReader();
                reader.onload = function(evt) {
                    var img = new Image();
                    img.onload = function() {
                        var ctx = paintCanvas.getContext('2d');
                        ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
                        ctx.drawImage(img, 0, 0, paintCanvas.width, paintCanvas.height);
                    };
                    img.src = evt.target.result;
                };
                reader.readAsDataURL(files[0]);
            }
        });
    }

    Usuario.updateUserIconAndName();
    // Hacer visible e interactivo el botón switch user
    const btn = document.getElementById('switch-user-btn');
    if(btn){
        btn.style.opacity = '0.7';
        btn.style.pointerEvents = 'auto';
        btn.onclick = Usuario.switchUser;
        btn.onmouseover = function(){btn.style.opacity=1;};
        btn.onmouseout = function(){btn.style.opacity=0.7;};
    }
    // Habilitar/deshabilitar botón subir a galería según usuario
    const uploadGalleryBtn = document.getElementById('upload-gallery-btn');
    if (uploadGalleryBtn) {
        if (Usuario.isAdmin()) {
            uploadGalleryBtn.disabled = false;
            uploadGalleryBtn.style.opacity = '1';
            uploadGalleryBtn.title = '';
        } else {
            uploadGalleryBtn.disabled = true;
            uploadGalleryBtn.style.opacity = '0.5';
            uploadGalleryBtn.title = 'Debes iniciar sesión como admin para subir a la galería';
        }
    }
});

// Botón Limpiar canvas
const clearBtn = document.getElementById('clear-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', function() {
        const paintCanvas = document.getElementById('paint-canvas');
        if (paintCanvas) {
            const ctx = paintCanvas.getContext('2d');
            ctx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
        }
    });
}

// Botón Descargar canvas como JPG
const downloadBtn = document.getElementById('download-btn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function() {
        const paintCanvas = document.getElementById('paint-canvas');
        if (paintCanvas) {
            // Crear un canvas temporal con fondo blanco
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = paintCanvas.width;
            tempCanvas.height = paintCanvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            // Fondo blanco
            tempCtx.fillStyle = '#fff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            // Dibuja el canvas original encima
            tempCtx.drawImage(paintCanvas, 0, 0);
            // Descargar como JPG
            const link = document.createElement('a');
            link.download = 'mi_dibujo.jpg';
            link.href = tempCanvas.toDataURL('image/jpeg', 0.95);
            link.click();
        }
    });
}

// Botón Subir a galería
const uploadGalleryBtn = document.getElementById('upload-gallery-btn');
if (uploadGalleryBtn) {
    uploadGalleryBtn.disabled = false;
    uploadGalleryBtn.style.opacity = '1';
    uploadGalleryBtn.title = '';
    uploadGalleryBtn.addEventListener('click', function() {
        const paintCanvas = document.getElementById('paint-canvas');
        if (paintCanvas) {
            // Crear un canvas temporal con fondo blanco
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = paintCanvas.width;
            tempCanvas.height = paintCanvas.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.fillStyle = '#fff';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(paintCanvas, 0, 0);
            // Obtener imagen en base64
            const imgData = tempCanvas.toDataURL('image/jpeg', 0.95);
            // Guardar en localStorage bajo el usuario current
            let dibujos = JSON.parse(localStorage.getItem('galeriaDibujos') || '[]');
            const nombre = 'midibujo' + (dibujos.length + 1);
            const currentUser = Usuario.getCurrentUser();
            dibujos.push({ nombre, imgData, fecha: new Date().toISOString(), user: currentUser ? currentUser.username : 'invitado' });
            localStorage.setItem('galeriaDibujos', JSON.stringify(dibujos));
            alert('¡Dibujo subido a la galería!');
        }
    });
}

// Lógica de logout universal para canvas y otras páginas
function setLogoutListener() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.setItem('currentUser', JSON.stringify({ nombre: 'Invitado', username: 'invitado', email: '', password: '' }));
            window.location.reload();
        });
    }
}

document.addEventListener('DOMContentLoaded', setLogoutListener);

// TODO: Implementar carga de imagen de referencia, drag & drop de imágenes arrastrables
