// login.js
// Manejo de login usando localStorage para usuarios

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    document.getElementById('userOrEmail-error').textContent = '';
    document.getElementById('password-error').textContent = '';
    const userOrEmail = document.getElementById('userOrEmail').value.trim();
    const password = document.getElementById('password').value;
    // Leer usuarios desde usuarios.txt
    let users = [];
    try {
        const res = await fetch('../usuarios/usuarios.txt');
        const text = await res.text();
        const lines = text.split('\n').filter(l => l.trim().length > 0 && !l.startsWith('//'));
        for (let i = 1; i < lines.length; i++) {
            const [nombre, username, email, pass] = lines[i].split(',');
            users.push({ nombre, username, email, password: pass });
        }
    } catch (err) {
        document.getElementById('userOrEmail-error').textContent = 'No se pudo acceder a la base de datos de usuarios.';
        return;
    }
    const user = users.find(u => (u.username === userOrEmail || u.email === userOrEmail) && u.password === password);
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'gallery.html';
    } else {
        document.getElementById('userOrEmail-error').textContent = 'Usuario, email o contraseña incorrectos.';
        document.getElementById('password-error').textContent = ' '; // Espacio para mantener altura
        setTimeout(() => window.location.reload(), 1200);
    }
    // Permitir login directo para admin (cuenta de prueba)
    if ((userOrEmail === 'admin' || userOrEmail === 'admin@test.com') && password === '1111') {
        const user = { nombre: 'Fulanito', username: 'admin', email: 'admin@test.com', password: '1111' };
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'gallery.html';
        return;
    }
});

// Icono autocompletar Fulanito
const autofill = document.getElementById('autofill-fulanito');
if (autofill) {
    autofill.addEventListener('click', function() {
        document.getElementById('userOrEmail').value = 'admin';
        document.getElementById('password').value = '1111';
    });
}
