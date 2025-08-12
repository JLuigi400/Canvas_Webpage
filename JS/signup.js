// signup.js
// Manejo de registro usando localStorage para usuarios

// Guardar usuario en usuarios.txt (solo si no existe)
async function guardarUsuarioEnTxt({ name, username, email, password }) {
    try {
        const res = await fetch('../usuarios/usuarios.txt');
        let text = await res.text();
        if (!text.includes(`,${username},`)) {
            text += `\n${name},${username},${email},${password}`;
            // No se puede escribir desde JS puro en navegador, pero aquí iría la lógica de guardado en backend o Node.js
            // Por ahora, solo simula el guardado en localStorage
            localStorage.setItem('usuarios_txt_sim', text);
        }
    } catch (e) {}
}

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    // Limpia mensajes de error
    ["name","username","email","password","confirmPassword"].forEach(id => {
        document.getElementById(id+"-error").textContent = '';
    });
    const name = document.getElementById('name').value.trim();
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    let valid = true;
    if (!name) {
        document.getElementById('name-error').textContent = 'Debes rellenar este campo';
        valid = false;
    }
    if (!username) {
        document.getElementById('username-error').textContent = 'Debes rellenar este campo';
        valid = false;
    }
    if (!email) {
        document.getElementById('email-error').textContent = 'Debes rellenar este campo';
        valid = false;
    }
    if (!password) {
        document.getElementById('password-error').textContent = 'Debes rellenar este campo';
        valid = false;
    }
    if (!confirmPassword) {
        document.getElementById('confirmPassword-error').textContent = 'Debes rellenar este campo';
        valid = false;
    }
    if (password && confirmPassword && password !== confirmPassword) {
        document.getElementById('confirmPassword-error').textContent = 'Las contraseñas no coinciden.';
        valid = false;
    }
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.username === username)) {
        document.getElementById('username-error').textContent = 'El nombre de usuario ya está registrado.';
        valid = false;
    }
    if (users.some(u => u.email === email)) {
        document.getElementById('email-error').textContent = 'El correo electrónico ya está registrado.';
        valid = false;
    }
    if (!valid) return;
    users.push({ name, username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    await guardarUsuarioEnTxt({ name, username, email, password });
    alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
});

// Precarga usuario de prueba si no existe
(function(){
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.some(u => u.username === 'admin')) {
        users.push({ name: 'Fulanito', username: 'admin', email: 'admin@test.com', password: '1111' });
        localStorage.setItem('users', JSON.stringify(users));
    }
})();
