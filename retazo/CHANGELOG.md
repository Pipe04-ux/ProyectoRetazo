# Changelog

## v0.3 — Look contracultural y más contraste
- Nuevo enfoque visual tipo fanzine / collage de pared: bordes gruesos, sombras duras sin degradados, textura de papel, cintas adhesivas, sellos de máquina de escribir y una cinta de texto que se desplaza en el inicio.
- Paleta apagada y terrosa (pizarra, óxido, ocre, musgo, rosa polvo, ciruela, tinta, crudo) en lugar de colores saturados.
- Contraste revisado con la fórmula WCAG: texto principal 13–17:1, texto secundario 6,8–9,9:1, acentos ≥ 5,1:1. Todo cumple AA.
- Tipografías nuevas: Archivo (títulos condensados), Work Sans (texto) y Special Elite (sellos).
- Nuevo en el diseñador: frase estampada opcional (+$10.000) que se dibuja en la prenda y se muestra al artesano.
- Corrección: el bordado ya no se superpone con la frase; los precios no se parten en dos líneas; el texto de los botones seleccionados mantiene el contraste.
- El estado guardado se reinicia (clave `retazo-proto-v3`).
- Si la página sale en blanco en GitHub Pages: faltan las carpetas `css/` y `js/` junto a `index.html`. Ahora la página muestra un aviso con los archivos que faltan.

## v0.2 — Prototipo funcional
- Aplicación de una sola página con rutas por hash, responsive y con modo claro/oscuro.
- Nuevo diseño: concepto de colcha de retazos (reemplazado en v0.3).
- Diseñador con vista previa SVG en vivo y precio dinámico.
- Flujo de cliente corregido: edición de diseño y de dirección sin perder datos, pago con reintento, retazos opcionales y recibo que lleva al seguimiento.
- Panel del artesano ampliado: pedidos con filtros, detalle con cambio de estado, guías de envío, reseñas con respuesta y configuración del taller.
- Estado compartido entre cliente y artesano (localStorage).

## v0.1 — Cartelera
- Wireflow de 11 pantallas en baja fidelidad (ver `PROTOTIPO.md`).
