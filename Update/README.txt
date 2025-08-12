# ATENCIÓN: FALTANTE DE RECURSO VISUAL
# El archivo 'gallery.png' no existe en 'Recursos/Imagenes/Icon/'.
# Es necesario agregar una imagen con ese nombre para que el ícono de la galería se muestre correctamente en el menú principal (index.html).
# Si mueves el proyecto a otro computador, recuerda añadir este archivo o reemplazar la referencia en el HTML/CSS.
# Puedes usar un ícono temporal o descargar uno de https://icons8.com/icons/set/gallery o similar.
# Ejemplo de ruta esperada: Recursos/Imagenes/Icon/gallery.png
#
# Otros íconos requeridos para el menú principal y herramientas SÍ están presentes.
# Revisa este archivo antes de migrar el proyecto para evitar imágenes rotas.

# Lineart & Color - README

## Descripción
Proyecto web de galería y editor de arte digital, con sistema de usuarios y galería personalizada.

## Avances recientes (25/05/2025)
- Menú principal (index.html) visual tipo grid, con recuadros horizontales, icono a la izquierda y resumen a la derecha, responsivo y con efecto hover.
- Nav profesional replicado en todas las páginas principales (excepto login/signup), con clase active para resaltar la página actual.
- Footer ajustado para no tapar contenido y siempre visible al fondo.
- Paneles laterales del canvas scrolleables, permitiendo acceso a todos los botones.
- login.html y signup.html con validación visual, mensajes de error y precarga de usuario de prueba.
- Galería personalizada por usuario, con imágenes de ejemplo para invitados y solo imágenes propias para usuarios logueados.
- Icono de usuario dinámico (guest/user).
- Botón "Subir a galería" funcional desde canvas y galería.
- Modal para ver imágenes ampliadas en la galería.
- Portabilidad asegurada: historial y documentación en archivos txt, instrucciones para GitHub privado.
- **Nuevo:** contacto.html ahora tiene un wrapper exclusivo para extender el ancho del contenido, alineado con header/footer, y estilos propios en estandar.css. Nav y footer consistentes con el resto del sitio.

## Cambios globales (26/05/2025)
- Nav profesional y footer replicados en todas las páginas principales (excepto login/signup), con clase active.
- Footer siempre visible y consistente.
- Menú principal (index.html) visual tipo grid, responsivo, con recuadros horizontales, icono a la izquierda y resumen a la derecha, efecto hover.
- Validación visual y mensajes claros en login/signup.
- Galería personalizada: invitados ven ejemplos, usuarios logueados ven solo sus imágenes.
- Botón "Subir a galería" solo para usuarios logueados.
- Modal para ver imágenes ampliadas en galería.
- Paneles laterales del canvas scrolleables.
- Wrapper exclusivo en contacto.html alineado con header/footer.
- Advertencia: falta el ícono gallery.png en Recursos/Imagenes/Icon/.
- Portabilidad: documentación y estructura lista para migrar o subir a GitHub.
- Lógica y experiencia de usuario replicada del juego a otras secciones donde aplica.

## Cambios en game.html, game.css y game.js (26/05/2025)
- Se integró el minijuego Luigi Tower Jump con Phaser 3.
- Nav profesional y footer replicados, con clase active y consistencia visual.
- Modal de instrucciones con controles visuales y animaciones de Luigi.
- Iconos de música y pausa interactivos, controlados desde JS.
- Experiencia de usuario mejorada: usuario dinámico, botones de login/signup/logout, actualización visual del usuario.
- Estilos exclusivos en game.css para el área de juego, responsivo y visualmente integrado.
- Lógica de juego, animaciones, puntaje, plataformas, música, pausa y eventos de usuario gestionados en game.js.

## Estructura de carpetas
- HTML/: Páginas principales (index, login, signup, gallery, canvas, game, contacto, etc.)
- CSS/: Estilos globales y específicos (estandar, canvas, gallery, game, menu, data)
- JS/: Scripts de funcionalidad (login, signup, galería, canvas, formulario, recursos, game)
- Recursos/: Imágenes, iconos y sonidos
- usuarios/: Usuarios de prueba (usuarios.txt)

## Próximos pasos sugeridos
- Mejorar validaciones y mensajes visuales en formularios.
- Agregar botón de cerrar sesión y refinar la experiencia de usuario.
- Permitir subida de imágenes a la galería desde gallery.html y canvas.html.
- Portabilidad y control de versiones.

---

**Cómo subir el proyecto a GitHub de forma privada:**
1. Crea un repositorio privado en GitHub (desde la web, botón "New repository", selecciona "Private").
2. Abre una terminal en la carpeta raíz del proyecto.
3. Ejecuta los siguientes comandos:
   git init
   git add .
   git commit -m "Primer commit"
   git remote add origin https://github.com/USUARIO/NOMBRE-REPO.git
   git branch -M main
   git push -u origin main

Reemplaza USUARIO y NOMBRE-REPO por los tuyos. Así tendrás una copia online privada.

**Cómo guardar manualmente el historial de la conversación:**
- Selecciona todo el texto de la conversación en Copilot Chat.
- Copia y pégalo en un archivo de texto (.txt o .md) dentro de tu proyecto.
- Puedes actualizar este archivo cada vez que avances o cambies de dispositivo.

## Nota importante sobre almacenamiento de usuarios
- El sistema actual utiliza LocalStorage del navegador para almacenar usuarios y sesiones de manera local y temporal.
- Si necesitas portabilidad o persistencia entre dispositivos, puedes:
  1. Exportar manualmente el contenido de LocalStorage a un archivo JSON y luego importarlo en el nuevo navegador.
  2. Simular una base de datos usando un archivo JSON local (por ejemplo, usuarios.json) y cargarlo mediante fetch o XMLHttpRequest (solo posible en servidores locales o con permisos adecuados).
  3. Para producción real, se recomienda implementar un backend (Node.js, Python, PHP, etc.) con una base de datos (SQLite, MySQL, MongoDB, etc.) para almacenar usuarios de forma segura y persistente.
- Ejemplo de exportación manual de usuarios desde la consola del navegador:
  ```js
  // Exportar
  const usuarios = localStorage.getItem('usuarios');
  // Copia el resultado y guárdalo en un archivo usuarios.json
  
  // Importar
  localStorage.setItem('usuarios', '...contenido del archivo usuarios.json...');
  ```
- Si cambias de computadora, asegúrate de copiar el archivo usuarios.txt (si lo usas) y/o exportar/importar el LocalStorage como se indica arriba.

---

Para dudas o pasos detallados, consulta la documentación de GitHub o pide ayuda aquí.
