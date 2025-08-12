// 📌 Variables globales
let gameRunning = false; // Controla si el juego está activo
let debugMode = false; // Activa o desactiva el modo depuración
let music; // Variable para la música
let isPaused = false; // Estado de pausa del juego
let player, suelo, sueloInvisible, cursors, scoreText, musicIcon, pauseIcon;
let platformGroup; // Grupo de plataformas generado dinámicamente
let score = 0; // Puntaje
let maxHeight = 743; // Altura máxima alcanzada (inicial en la posición inicial del jugador)

// Variables globales para nubes
let nubesFondo = [];
let nubesDelante = [];
let nubesFondo03 = [];
let torreTileSprite;
let torreTileSprite2; // Segunda torre para parallax
let autoMoveNubesDelante = false;
let autoMoveNubesTimer = null;
let nubesTimerStarted = false;

// === SPRITES DE MOVIMIENTO ===
const luigiMoveFrames = [];
for (let i = 0; i < 8; i++) {
    luigiMoveFrames.push(`LuigiM0${i}`);
}
let moveFrameIndex = 0;
let moveFrameTimer = 0;
const moveFrameInterval = 80; // ms entre frames
let isMoving = false;
let lastDirection = 'right'; // 'left' o 'right'

// 📌 Función para iniciar el juego
function startGame() {
    if (!gameRunning) {
        document.getElementById('preview-text').style.display = 'none';
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('game-title').style.display = 'none';
        document.getElementById('instructions-btn').style.display = 'none';

        gameRunning = true; // ✅ Ahora el juego inicia correctamente

        let config = {
            type: Phaser.AUTO,
            width: 600,
            height: 800,
            parent: 'game-container', // Renderizar dentro del contenedor HTML
            physics: { default: 'arcade', arcade: { gravity: { y: 500 }, debug: false } },
            scene: { preload, create, update }
        };

        gameInstance = new Phaser.Game(config); // ✅ Guarda la instancia del juego
    }
}

// 📌 Activar el juego con el botón de inicio
document.getElementById('start-game').addEventListener('click', startGame);

// 📌 Función para cargar recursos (sprites, sonidos, imágenes)
function preload() {
    this.load.image('background', '../Recursos/Imagenes/Assets/Game/fondo.jpg'); // Fondo actualizado a formato JPG
    this.load.image('torre', '../Recursos/Imagenes/Assets/Game/torre.png'); // Imagen de la torre más angosta
    this.load.image('platform', '../Recursos/Imagenes/Assets/Game/platform.png'); // Imagen de plataforma
    this.load.image('luigi_stand', '../Recursos/Imagenes/Assets/Game/luigi_stand.png');
    this.load.image('luigi_jump', '../Recursos/Imagenes/Assets/Game/luigi_jump.png');
    this.load.image('luigi_fall', '../Recursos/Imagenes/Assets/Game/luigi_fall.png');
    this.load.image('music_on', '../Recursos/Imagenes/Assets/Game/music_on.png');
    this.load.image('music_off', '../Recursos/Imagenes/Assets/Game/music_off.png');
    this.load.image('pause', '../Recursos/Imagenes/Assets/Game/pause.png');
    // Precargar nubes
    this.load.image('nube01', '../Recursos/Imagenes/Assets/Game/nube01.png');
    this.load.image('nube02', '../Recursos/Imagenes/Assets/Game/nube02.png');
    this.load.image('nube03', '../Recursos/Imagenes/Assets/Game/nube03.png');
    this.load.audio('backgroundMusic', '../Recursos/Sonido/OST/OSTLokingAhead.mp3'); // Ruta de música actualizada
    // Cargar sprites de movimiento
    for (let i = 0; i < 8; i++) {
        this.load.image(`LuigiM0${i}`, `../Recursos/Imagenes/Assets/Game/Move/LuigiM0${i}.png`);
    }
}

function create() {
    // 🏙️ Fondo y torre
    this.add.image(300, 400, 'background').setDisplaySize(600, 900).setDepth(-2); // Escalado y centrado para cubrir líneas negras
    // Nubes fondo (nube03, 1 o 2)
    let numNube03 = Phaser.Math.Between(1, 2);
    for (let i = 0; i < numNube03; i++) {
        let x = Phaser.Math.Between(50, 550);
        let y = Phaser.Math.Between(100, 600);
        let nube = this.add.image(x, y, 'nube03').setScale(Phaser.Math.FloatBetween(0.7, 1.2)).setAlpha(0.5).setDepth(-1.8);
        nubesFondo03.push(nube);
    }
    // Nubes fondo (nube01 y nube02, detrás de la torre)
    let numNube01 = Phaser.Math.Between(3, 6);
    let numNube02 = Phaser.Math.Between(2, 4);
    for (let i = 0; i < numNube01; i++) {
        let x = Phaser.Math.Between(0, 600);
        let y = Phaser.Math.Between(50, 700);
        let nube = this.add.image(x, y, 'nube01').setScale(Phaser.Math.FloatBetween(0.5, 1.1)).setAlpha(0.7).setDepth(-1.5);
        nubesFondo.push(nube);
    }
    for (let i = 0; i < numNube02; i++) {
        let x = Phaser.Math.Between(0, 600);
        let y = Phaser.Math.Between(50, 700);
        let nube = this.add.image(x, y, 'nube02').setScale(Phaser.Math.FloatBetween(0.5, 1.1)).setAlpha(0.7).setDepth(-1.4);
        nubesFondo.push(nube);
    }
    // Torre principal
    torreTileSprite = this.add.tileSprite(300, 400, 450, 800, 'torre').setDepth(-1);
    // Segunda torre para parallax, ubicada justo encima de la primera
    torreTileSprite2 = this.add.tileSprite(300, -400, 450, 800, 'torre').setDepth(-1);
    // Nubes delante de la torre (nube01 y nube02, más cercanas)
    let numNube01Front = Phaser.Math.Between(2, 4);
    let numNube02Front = Phaser.Math.Between(2, 4);
    for (let i = 0; i < numNube01Front; i++) {
        let x = Phaser.Math.Between(0, 600);
        let y = Phaser.Math.Between(50, 700);
        let nube = this.add.image(x, y, 'nube01').setScale(Phaser.Math.FloatBetween(0.7, 1.2)).setAlpha(0.85).setDepth(2000); // Muy enfrente
        nube.nubeTipo = 'nube01';
        nubesDelante.push(nube);
    }
    for (let i = 0; i < numNube02Front; i++) {
        let x = Phaser.Math.Between(0, 600);
        let y = Phaser.Math.Between(50, 700);
        let nube = this.add.image(x, y, 'nube02').setScale(Phaser.Math.FloatBetween(0.7, 1.2)).setAlpha(0.85).setDepth(2000); // Muy enfrente
        nube.nubeTipo = 'nube02';
        nubesDelante.push(nube);
    }

    // 🏗️ Generar suelo con plataformas estáticas
    suelo = this.physics.add.staticGroup();
    for (let i = 0; i < 80; i++) {
        let posX = i * 25;
        suelo.create(posX, 780, 'platform').refreshBody();
    }

    // 🔍 Agregar un suelo invisible para evitar errores de caída
    sueloInvisible = this.physics.add.staticGroup();
    sueloInvisible.create(300, 779).setSize(600, 10).setVisible(false);

    // 🎮 Configuración del personaje
    player = this.physics.add.sprite(300, 743, 'luigi_stand').setScale(0.5);
    player.setCollideWorldBounds(true);

    // 🚀 Colisiones
    this.physics.add.collider(player, suelo);
    this.physics.add.collider(player, sueloInvisible);
    sueloCollider = this.physics.add.collider(player, suelo); // Guardamos el collider para poder eliminarlo

    // 🎮 Controles del jugador
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', jump, this);

    // 🏆 Texto del puntaje
    scoreText = this.add.text(20, 20, 'Puntos: 0', {
        fontSize: '32px',
        fontWeight: 'bold',
        fill: '#ffcc00', // Amarillo
        stroke: '#000',
        strokeThickness: 4,
        fontFamily: 'Press Start 2P, Arial, sans-serif',
        shadow: { offsetX: 3, offsetY: 3, color: '#000', blur: 6, fill: true }
    });
    scoreText.setDepth(1000); // Siempre al frente

    // 🎵 Música de fondo
    music = this.sound.add('backgroundMusic', { loop: true });
    music.setVolume(0.5);
    music.play();

    // 🎵 Icono de música
    musicIcon = this.add.image(550, 50, music.isPlaying ? 'music_on' : 'music_off').setScale(0.10).setInteractive();
    musicIcon.setDepth(3000); // Siempre enfrente de todo
    musicIcon.on('pointerdown', toggleMusic);

    // ⏸ Icono de pausa
    pauseIcon = this.add.image(500, 50, 'pause').setScale(0.10).setInteractive();
    pauseIcon.setDepth(3000); // Siempre enfrente de todo
    pauseIcon.on('pointerdown', togglePause);

    // 🏗️ Generación de plataformas iniciales
    platformGroup = this.physics.add.staticGroup();
    generateInitialPlatforms();
    this.physics.add.collider(player, platformGroup, onPlatformCollide, null, this);
}

// 📌 Función para actualizar el juego (movimiento, generación de plataformas)
function update(time, delta) {
    if (!isPaused) {
        movePlayer(delta);
    }
    // Animación de Luigi según estado vertical
    if (player.body.velocity.y < -10) {
        // Sube
        if (player.texture.key !== 'luigi_jump') player.setTexture('luigi_jump');
    } else if (player.body.velocity.y > 10 && !player.body.touching.down) {
        // Cae
        if (player.texture.key !== 'luigi_fall') player.setTexture('luigi_fall');
    } else if (player.body.touching.down) {
        // En el suelo
        if (isMoving) {
            // Animación de caminar
            moveFrameTimer += delta;
            if (moveFrameTimer > moveFrameInterval) {
                moveFrameIndex = (moveFrameIndex + 1) % luigiMoveFrames.length;
                moveFrameTimer = 0;
            }
            player.setTexture(luigiMoveFrames[moveFrameIndex]);
            player.setFlipX(lastDirection === 'left');
        } else {
            // Quieto
            if (player.texture.key !== 'luigi_stand') player.setTexture('luigi_stand');
        }
    }
    // Solo mover torres y nubes cuando el jugador sube (player.y < 400)
    if (player.y < 400) {
        let delta = 400 - player.y;
        player.y = 400;
        // Mover plataformas y suelos
        platformGroup.children.iterate((platform) => {
            platform.y += delta;
            platform.refreshBody();
        });
        suelo.children.iterate((ground) => {
            ground.y += delta;
            ground.refreshBody();
        });
        sueloInvisible.children.iterate((ground) => {
            ground.y += delta;
            ground.refreshBody();
        });
        // Torres bajan indefinidamente, efecto parallax cíclico
        if (torreTileSprite && torreTileSprite2) {
            torreTileSprite.y += delta;
            torreTileSprite2.y += delta;
            // Si una torre sale por abajo, la reciclamos justo encima de la otra
            if (torreTileSprite.y > 1200) torreTileSprite.y = torreTileSprite2.y - 800;
            if (torreTileSprite2.y > 1200) torreTileSprite2.y = torreTileSprite.y - 800;
        }
        // Nubes bajan indefinidamente, efecto parallax cíclico
        nubesFondo03.forEach(nube => {
            nube.y += delta * 0.2;
            if (nube.y > 900) nube.y = Phaser.Math.Between(-100, 0);
        });
        nubesFondo.forEach(nube => {
            nube.y += delta * 0.5;
            if (nube.y > 900) nube.y = Phaser.Math.Between(-100, 0);
        });
        nubesDelante.forEach(nube => {
            nube.y += delta * 0.9;
            if (nube.y > 900) nube.y = Phaser.Math.Between(-100, 0);
        });
        // Actualiza la altura máxima alcanzada
        if (player.y < maxHeight) {
            maxHeight = player.y;
        }
    } else {
        // Si la base no desaparece, las nubes quedan en su posición original
        // (No forzar y=-200, así se mantienen donde fueron creadas)
    }

    // Reciclar plataformas que salen de pantalla y generar nuevas
    platformGroup.children.iterate((platform) => {
        if (platform.y > 850) {
            // Genera nueva plataforma en Y=-50, X aleatorio alcanzable respecto a la más alta
            let lastPlatform = getHighestPlatform();
            let posY = -50; // Siempre arriba
            let minX = Math.max(80, lastPlatform.x - 80); // Permite un reto mayor, pero alcanzable
            let maxX = Math.min(520, lastPlatform.x + 80);
            let posX = Phaser.Math.Between(minX, maxX);
            // Espaciado vertical entre plataformas recicladas: máximo 100px
            // (Como Y=-50 es fijo, solo aseguramos que la anterior esté suficientemente lejos)
            if (lastPlatform.y - posY < 60) {
                posY = lastPlatform.y - Phaser.Math.Between(80, 100);
            }
            platform.y = posY;
            platform.x = posX;
            platform.refreshBody();
        }
    });

    // Si el jugador sube, mover plataformas y suelo hacia abajo
    if (player.y < 400) {
        let delta = 400 - player.y;
        player.y = 400;
        platformGroup.children.iterate((platform) => {
            platform.y += delta;
            platform.refreshBody();
        });
        suelo.children.iterate((ground) => {
            ground.y += delta;
            ground.refreshBody();
        });
        sueloInvisible.children.iterate((ground) => {
            ground.y += delta;
            ground.refreshBody();
        });
        // Actualiza la altura máxima alcanzada
        if (player.y < maxHeight) {
            maxHeight = player.y;
        }
    }

    // Elimina el collider del suelo si el jugador sube por encima de la pantalla inicial
    if (player.y < 700 && sueloCollider) {
        this.physics.world.removeCollider(sueloCollider);
        sueloCollider = null;
        // Inicia el timer SOLO UNA VEZ cuando la base desaparece
        if (!nubesTimerStarted) {
            nubesTimerStarted = true;
            if (autoMoveNubesTimer) clearTimeout(autoMoveNubesTimer);
            autoMoveNubesTimer = setTimeout(() => {
                autoMoveNubesDelante = true;
            }, 5000);
        }
    }
    // Movimiento automático de nubes de fondo (parallax continuo)
    nubesFondo.forEach(nube => {
        let vel = 0.6; // Default para nube01
        if (nube.texture && nube.texture.key === 'nube02') vel = 0.4;
        nube.y += vel;
        if (nube.y > 900) nube.y = Phaser.Math.Between(-100, 0);
    });
    nubesFondo03.forEach(nube => {
        nube.y += 0.2;
        if (nube.y > 900) nube.y = Phaser.Math.Between(-100, 0);
    });
    // Movimiento automático de nubes delanteras (parallax) SOLO después de los 5 segundos
    if (autoMoveNubesDelante) {
        nubesDelante.forEach(nube => {
            let vel = 0.5; // Default para nube01
            if (nube.nubeTipo === 'nube02') vel = 0.3;
            if (nube.nubeTipo === 'nube03') vel = 0.1;
            nube.y += vel;
            if (nube.y > 900) nube.y = Phaser.Math.Between(-100, 0);
        });
    }

    // Actualiza el puntaje en base a la altura máxima (metros)
    let metros = Math.max(0, Math.round((743 - maxHeight) / 2)); // 1 punto cada 2px de subida
    scoreText.setText('Altura: ' + metros + ' m');

    // Ajuste para que el personaje pueda salir por el borde inferior y activar Game Over
    player.setCollideWorldBounds(false); // Permite salir por abajo
    if (player.y > 800 && !isPaused) { // 800 es el borde inferior de la pantalla
        showGameOverScreen();
    }
}

// Nueva función para encontrar la plataforma más alta (objeto)
function getHighestPlatform() {
    let minY = 800;
    let highest = null;
    platformGroup.children.iterate((platform) => {
        if (platform.y < minY) {
            minY = platform.y;
            highest = platform;
        }
    });
    return highest;
}

// Nueva función para encontrar la plataforma más alta
function getHighestPlatformY() {
    let minY = 800;
    platformGroup.children.iterate((platform) => {
        if (platform.y < minY) minY = platform.y;
    });
    return minY;
}

// 📌 Función de movimiento del personaje
function movePlayer(delta) {
    isMoving = false;
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        lastDirection = 'left';
        isMoving = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        lastDirection = 'right';
        isMoving = true;
    } else {
        player.setVelocityX(0);
    }
}

// 📌 Función de salto del personaje
function jump() {
    if (player.body.touching.down) {
        player.setVelocityY(-450);
        player.setTexture('luigi_jump');
    }
}

// 📌 Función para generar plataformas aleatoriamente
function generateInitialPlatforms() {
    // Genera plataformas en posiciones justas y alcanzables
    let lastY = 750;
    let lastX = 300;
    for (let i = 0; i < 8; i++) {
        // Espaciado vertical entre 100 y 125 px
        let posY = lastY - Phaser.Math.Between(100, 125);
        let minX = Math.max(80, lastX - 50);
        let maxX = Math.min(520, lastX + 50);
        let posX = Phaser.Math.Between(minX, maxX);
        let newPlatform = platformGroup.create(posX, posY, 'platform');
        newPlatform.setImmovable(true);
        newPlatform.body.allowGravity = false;
        lastY = posY;
        lastX = posX;
    }
}

function onPlatformCollide(player, platform) {
    // Permite saltar solo si cae sobre la plataforma
    if (player.body.velocity.y > 0) {
        player.setVelocityY(-450);
        player.setTexture('luigi_jump');
    }
}

// 📌 Función para mostrar pantalla de fin del juego
function showGameOverScreen() {
    if (document.getElementById('gameover-overlay')) return; // Evita múltiples overlays
    isPaused = true;
    // Oscurece solo el área del juego
    let gameContainer = document.getElementById('game-container');
    let overlay = document.createElement('div');
    overlay.id = 'gameover-overlay';
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '100';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.pointerEvents = 'auto';
    gameContainer.appendChild(overlay);

    let gameOverScreen = document.createElement('div');
    gameOverScreen.id = 'game-over';
    gameOverScreen.style.position = 'relative';
    gameOverScreen.style.background = '#222';
    gameOverScreen.style.border = '4px solid #ffcc00';
    gameOverScreen.style.borderRadius = '16px';
    gameOverScreen.style.padding = '24px 32px'; // Reducido para menor altura
    gameOverScreen.style.textAlign = 'center';
    gameOverScreen.style.boxShadow = '0 0 30px #000';
    gameOverScreen.style.zIndex = '101';
    gameOverScreen.style.maxHeight = '260px'; // Limita la altura máxima
    gameOverScreen.style.overflow = 'auto'; // Permite scroll si el contenido crece
    gameOverScreen.innerHTML = `
        <h2 style='color: #ffcc00;'>Fin del juego</h2>
        <p class="gameover-yellow" style="font-size: 22px; font-family: 'Press Start 2P', Arial, sans-serif;">${scoreText.text}</p>
        <button id="btn-menu" style='margin: 10px; padding: 10px 30px; font-size: 18px; border-radius: 8px; border: none; background: #ffcc00; color: #222; font-weight: bold;'>Volver al inicio</button>
    `;
    overlay.appendChild(gameOverScreen);
    document.getElementById('btn-menu').onclick = returnToMenu;
}

function returnToMenu() {
    window.location.reload(); // Recarga la página para limpiar todo el estado y evitar música duplicada
}

// PAUSA: oscurecer pantalla y mostrar menú
function togglePause() {
    if (document.getElementById('pause-overlay') || isPaused) return; // Evita múltiples overlays o pausar si ya está en pausa/game over
    isPaused = true;
    if (music && music.isPlaying) music.pause();
    // Oscurecer solo el área del juego
    let gameContainer = document.getElementById('game-container');
    let pauseOverlay = document.createElement('div');
    pauseOverlay.id = 'pause-overlay';
    pauseOverlay.style.position = 'absolute';
    pauseOverlay.style.top = '0';
    pauseOverlay.style.left = '0';
    pauseOverlay.style.width = '100%';
    pauseOverlay.style.height = '100%';
    pauseOverlay.style.background = 'rgba(0,0,0,0.5)';
    pauseOverlay.style.display = 'flex';
    pauseOverlay.style.justifyContent = 'center';
    pauseOverlay.style.alignItems = 'center';
    pauseOverlay.style.zIndex = '100';
    pauseOverlay.style.pointerEvents = 'auto';
    gameContainer.appendChild(pauseOverlay);
    pauseOverlay.innerHTML = `
        <div style="background: #222; border: 4px solid #ffcc00; border-radius: 16px; padding: 40px 60px; text-align: center; box-shadow: 0 0 30px #000; z-index: 101;">
            <h2 style='color: #ffcc00; margin-bottom: 30px;'>Juego en pausa</h2>
            <button id='btn-continue' style='margin: 10px; padding: 10px 30px; font-size: 18px; border-radius: 8px; border: none; background: #ffcc00; color: #222; font-weight: bold;'>Continuar</button><br>
            <button id='btn-exit' style='margin: 10px; padding: 10px 30px; font-size: 18px; border-radius: 8px; border: none; background: #fff; color: #222; font-weight: bold;'>Volver al inicio</button>
        </div>
    `;
    document.getElementById('btn-continue').onclick = () => {
        let overlay = document.getElementById('pause-overlay');
        if (overlay) overlay.remove();
        isPaused = false;
        if (music && music.isPaused) music.resume();
    };
    document.getElementById('btn-exit').onclick = () => {
        window.location.reload(); // Recarga la página para limpiar todo el estado y evitar música duplicada
    };
}

// Corrige el icono de música y reduce el volumen
function toggleMusic() {
    if (music.isPlaying) {
        music.pause();
        if (musicIcon) musicIcon.setTexture('music_off');
    } else {
        music.resume();
        if (musicIcon) musicIcon.setTexture('music_on');
    }
}

// Lógica de logout universal para game.html
function setLogoutListener() {
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.setItem('currentUser', JSON.stringify({ nombre: 'Invitado', username: 'invitado', email: '', password: '' }));
            window.location.reload();
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setLogoutListener();
    // Cambiar icono de usuario según tipo
    const userNameSpan = document.querySelector('.user-name');
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
    // Modal instrucciones
    const btn = document.getElementById('instructions-btn');
    const modal = document.getElementById('instructions-modal');
    const close = document.getElementById('close-instructions');
    if (btn && modal && close) {
        btn.onclick = () => { 
            modal.style.display = 'block';
            // Animación de preview de movimiento
            const movePreview = document.getElementById('move-preview');
            if (movePreview && movePreview.childElementCount === 0) {
                let frame = 0;
                let imgs = [];
                for (let i = 0; i < 8; i++) {
                    let img = document.createElement('img');
                    img.src = `../Recursos/Imagenes/Assets/Game/Move/LuigiM0${i}.png`;
                    img.width = 28;
                    img.height = 67;
                    img.style.background = '#fff';
                    img.style.borderRadius = '4px';
                    img.style.border = '1px solid #ccc';
                    img.style.display = (i === 0) ? 'inline' : 'none';
                    imgs.push(img);
                    movePreview.appendChild(img);
                }
                let dir = 1;
                let interval = setInterval(() => {
                    imgs[frame].style.display = 'none';
                    frame = (frame + dir + 8) % 8;
                    imgs[frame].style.display = 'inline';
                }, 90);
                // Guardar para limpiar luego
                movePreview._interval = interval;
            }
        };
        close.onclick = () => { 
            modal.style.display = 'none';
            // Limpiar animación
            const movePreview = document.getElementById('move-preview');
            if (movePreview && movePreview._interval) {
                clearInterval(movePreview._interval);
                movePreview._interval = null;
                // Reset preview
                Array.from(movePreview.children).forEach((img, i) => {
                    img.style.display = (i === 0) ? 'inline' : 'none';
                });
            }
        };
        window.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });
    }
});