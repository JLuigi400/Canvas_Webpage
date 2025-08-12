// gallery.js
// Galería tipo Instagram: muestra imágenes guardadas en localStorage
// Incluye comentarios explicativos para cada parte

document.addEventListener('DOMContentLoaded', function() {
    const grid = document.getElementById('gallery-grid');
    const modal = document.getElementById('modal-view');
    const modalImg = document.getElementById('modal-img');
    const modalBg = modal.querySelector('.modal-bg');
    const userNameSpan = document.querySelector('.user-name');
    const loginBtn = document.querySelector('.login-btn');
    const signupBtn = document.querySelector('.signup-btn');
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Cerrar sesión';
    logoutBtn.className = 'logout-btn';

    // Cargar usuario actual
    let currentUser = Usuario.getCurrentUser();

    // Renderiza la galería de imágenes
    function renderGallery() {
        grid.innerHTML = '';
        let dibujos = JSON.parse(localStorage.getItem('galeriaDibujos') || '[]');
        if (Usuario.isAdmin()) {
            dibujos = dibujos.filter(d => d.user === 'admin' || d.user === 'admin@test.com');
            if (dibujos.length === 0) {
                grid.innerHTML = '<p style="color:#888;text-align:center;width:100%;">No tienes dibujos en tu galería.<br>¡Sube uno desde el editor o el botón de subir!</p>';
                return;
            }
        } else {
            // Invitado: mostrar 8 imágenes de ejemplo
            const ejemplos = [
                {src: '../Recursos/Imagenes/Examples/example01.png', alt: 'Ejemplo 1'},
                {src: '../Recursos/Imagenes/Examples/example02.png', alt: 'Ejemplo 2'},
                {src: '../Recursos/Imagenes/Examples/example03.png', alt: 'Ejemplo 3'},
                {src: '../Recursos/Imagenes/Examples/example04.png', alt: 'Ejemplo 4'},
                {src: '../Recursos/Imagenes/Examples/example05.jpg', alt: 'Ejemplo 5'},
                {src: '../Recursos/Imagenes/Examples/example06.jpg', alt: 'Ejemplo 6'},
                {src: '../Recursos/Imagenes/Examples/example07.jpg', alt: 'Ejemplo 7'},
                {src: '../Recursos/Imagenes/Examples/example08.jpg', alt: 'Ejemplo 8'}
            ];
            ejemplos.forEach(ej => {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                item.innerHTML = `<img src="${ej.src}" alt="${ej.alt}">`;
                grid.appendChild(item);
            });
            return;
        }
        dibujos.forEach((d, i) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.title = d.nombre;
            item.innerHTML = `<img src="${d.imgData}" alt="${d.nombre}">`;
            item.addEventListener('click', () => {
                modalImg.src = d.imgData;
                modal.style.display = 'flex';
            });
            grid.appendChild(item);
        });
    }

    // Mostrar imagen en grande al hacer click (modal cubre toda la pantalla)
    grid.addEventListener('click', function(e) {
        const img = e.target.closest('img');
        if (img) {
            modalImg.src = img.src;
            modal.style.display = 'flex';
            modal.style.background = 'rgba(0,0,0,0.7)';
            modalImg.style.maxWidth = '90vw';
            modalImg.style.maxHeight = '90vh';
            modalImg.style.border = '12px solid #fff';
            modalImg.style.boxShadow = '0 0 32px 8px #222';
            modalImg.style.borderRadius = '18px';
        }
    });
    // Cerrar modal al hacer click en cualquier parte del modal
    modal.addEventListener('click', function() {
        modal.style.display = 'none';
        modalImg.src = '';
    });

    // Cerrar modal al hacer click fuera de la imagen
    modalBg.addEventListener('click', () => {
        modal.style.display = 'none';
        modalImg.src = '';
    });

    // Mostrar nombre de usuario y botones
    Usuario.updateUserIconAndName();
    if (Usuario.isAdmin()) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        userNameSpan.textContent = 'admin';
        loginBtn.parentNode.appendChild(logoutBtn);
    } else {
        userNameSpan.textContent = 'Invitado';
        loginBtn.style.display = '';
        signupBtn.style.display = '';
        if (logoutBtn.parentNode) logoutBtn.parentNode.removeChild(logoutBtn);
    }

    // Mostrar/ocultar botón de subir dibujo según usuario
    const uploadBtn = document.getElementById('upload-gallery-btn');
    if (uploadBtn) {
        if (Usuario.isAdmin()) {
            uploadBtn.style.display = 'block';
        } else {
            uploadBtn.style.display = 'none';
        }
    }

    // Logout
    logoutBtn.addEventListener('click', function() {
        document.dispatchEvent(new CustomEvent('usuario:logout'));
        window.location.reload();
    });

    // Redirección a login/signup
    loginBtn.addEventListener('click', function() {
        window.location.href = 'login.html';
    });
    signupBtn.addEventListener('click', function() {
        window.location.href = 'signup.html';
    });

    // Subir imagen a galería desde el botón (solo usuarios logueados)
    if (uploadBtn && Usuario.isAdmin()) {
        uploadBtn.onclick = function() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        let dibujos = JSON.parse(localStorage.getItem('galeriaDibujos') || '[]');
                        const nombre = file.name || 'dibujo';
                        dibujos.push({ nombre, imgData: evt.target.result, fecha: new Date().toISOString(), user: 'admin' });
                        localStorage.setItem('galeriaDibujos', JSON.stringify(dibujos));
                        renderGallery();
                        alert('¡Imagen subida a tu galería!');
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        };
    }

    // Render inicial
    renderGallery();
});
