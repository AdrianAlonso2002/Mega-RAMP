# Niveles guardados del editor 3D

Los diseños de `src/levels/editor-saved/world-XX.json` se recuperaron del editor
de `http://localhost:5173`. Son los diseños oficiales que se incluyen en la
compilación y en GitHub Pages. Las etapas sin versión guardada conservan su diseño base.

Con `npm run dev` y el juego abierto en `localhost` o `127.0.0.1`, las versiones
guardadas del navegador se copian al proyecto al entrar y cada vez que se guarda
en el editor. La consola confirma el número de etapas incorporadas. Si falla,
aparece un aviso; los datos del navegador se conservan.

Antes de publicar, incluye los archivos JSON modificados en el commit y haz push
a `develop`. GitHub compila esos archivos, no puede leer los guardados de Chrome.
La sincronización es exclusiva del servidor local de desarrollo y no existe en
la versión publicada. No modifica partidas, opciones ni desbloqueos.

Eliminar un guardado del navegador no elimina su copia oficial del proyecto.
