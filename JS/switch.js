// switch.js - Maneja el botón Switch User de forma global
(function(){
    // Siempre iniciar como invitado si no hay usuario
    if(!localStorage.getItem('currentUser')){
        localStorage.setItem('currentUser', JSON.stringify({nombre:'Invitado',username:'invitado',email:'',password:''}));
    }
    // Cambiar icono de usuario según tipo
    const userIcon = document.querySelector('.user-icon');
    let currentUser = null;
    try {
        currentUser = JSON.parse(localStorage.getItem('currentUser'));
    } catch {}
    if (userIcon) {
        if (!currentUser || currentUser.username === 'invitado') {
            userIcon.src = '../Recursos/Imagenes/Icon/guest_icon.png';
        } else if (currentUser.username === 'admin') {
            userIcon.src = '../Recursos/Imagenes/Icon/user_icon.png';
        } else {
            userIcon.src = '../Recursos/Imagenes/Icon/user_icon.png';
        }
    }
    // Botón para alternar usuario admin/invitado
    const btn = document.getElementById('switch-user-btn');
    if(btn){
        btn.onclick = function(){
            let current = JSON.parse(localStorage.getItem('currentUser')||'null');
            if(current && current.username==="admin"){
                localStorage.setItem('currentUser', JSON.stringify({nombre:'Invitado',username:'invitado',email:'',password:''}));
            }else{
                localStorage.setItem('currentUser', JSON.stringify({nombre:'Fulanito',username:'admin',email:'admin@test.com',password:'1111'}));
            }
            location.reload();
        };
        btn.onmouseover = function(){btn.style.opacity=0.7;};
        btn.onmouseout = function(){btn.style.opacity=0.1;};
        // Color y transparencia global
        btn.style.background = '#eafff2';
        btn.style.opacity = 0.1;
    }
})();
