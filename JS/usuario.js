// usuario.js
// Manejo centralizado de usuario actual (admin/invitado) y sesión

const USUARIO_ADMIN = { nombre: 'Fulanito', username: 'admin', email: 'admin@test.com', password: '1111' };
const USUARIO_INVITADO = { nombre: 'Invitado', username: 'invitado', email: '', password: '' };

function getCurrentUser() {
    try {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.username) return user;
    } catch {}
    return null;
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.username === 'admin';
}

function isInvitado() {
    const user = getCurrentUser();
    return !user || user.username === 'invitado';
}

function switchUser() {
    if (isAdmin()) {
        setCurrentUser(USUARIO_INVITADO);
    } else {
        setCurrentUser(USUARIO_ADMIN);
    }
    location.reload();
}

function ensureUserInitialized() {
    if (!getCurrentUser()) {
        setCurrentUser(USUARIO_INVITADO);
    }
}

function updateUserIconAndName() {
    const user = getCurrentUser();
    const userIcon = document.querySelector('.user-icon');
    const userNameSpan = document.querySelector('.user-name');
    if (userIcon) {
        if (!user || user.username === 'invitado') {
            userIcon.src = '../Recursos/Imagenes/Icon/guest_icon.png';
        } else if (user.username === 'admin') {
            userIcon.src = '../Recursos/Imagenes/Icon/user_icon.png';
        } else {
            userIcon.src = '../Recursos/Imagenes/Icon/user_icon.png';
        }
    }
    if (userNameSpan) {
        userNameSpan.textContent = user ? user.username : 'Invitado';
    }
}

// Para usar en login.js y signup.js
document.addEventListener('usuario:login', function(e) {
    setCurrentUser(e.detail);
    updateUserIconAndName();
});

document.addEventListener('usuario:logout', function() {
    setCurrentUser(USUARIO_INVITADO);
    updateUserIconAndName();
});

// Exportar funciones para uso global
typeof window !== 'undefined' && (window.Usuario = {
    getCurrentUser,
    setCurrentUser,
    isAdmin,
    isInvitado,
    switchUser,
    ensureUserInitialized,
    updateUserIconAndName
});
