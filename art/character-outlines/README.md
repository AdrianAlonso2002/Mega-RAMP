# Contorno de personajes

Los 72 PNG conservan su tinta y su grosor originales. La revisión 3 sustituye
el recorte fino anterior por un suavizado ligero de la transparencia exterior
(limitado al contorno, filtro gaussiano separable de sigma 0,65 píxeles, radio 2). No se borra ni se
reconstruye el borde negro. Se conservan los colores originales de todos los
píxeles visibles y el dibujo interior, las dimensiones y la posición de las poses.

originals/ contiene los archivos originales exactos, incluidos los retoques
manuales de Adri. manifest.json relaciona cada imagen con su respaldo y hashes.
La migración desde la revisión 1 vuelve al respaldo original antes de suavizar;
no suaviza las imágenes que tenían el borde reducido. Nuevas ejecuciones omiten
los archivos ya procesados para no acumular desenfoque.

npm run outline:characters aplica el proceso; optimize-media también lo utiliza.
Las fuentes antiguas en art/source/media/assets/characters no se modifican.
Actualizar esas fuentes si se retocan a mano los PNG antes de usar optimize-media.
No se añade una segunda línea por shader. La revisión de URL renueva la caché.

compare-heads.png y compare-adri.png: original a la izquierda, suavizado a la derecha.

