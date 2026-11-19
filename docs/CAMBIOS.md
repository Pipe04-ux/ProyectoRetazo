# De la cartelera al prototipo funcional: todos los cambios

Este documento compara el **prototipo de baja fidelidad** (paso 2, dibujado en la cartelera) con el **prototipo funcional** (paso 4, versión v0.4 publicada en GitHub Pages).

## Resumen en números

| | Cartelera (baja fidelidad) | Funcional (v0.4) |
|---|---|---|
| Pantallas | 11 | 17 (11 de cliente y 6 de artesano) |
| Tipos de prenda | Sin definir | 6 (camisa, vestido, pantalón, chaqueta, falda, buzo) |
| Telas | Sin definir | 4 (algodón, lino, dril, tela reciclada) |
| Colores | Sin definir | 8 (paleta apagada) |
| Detalles opcionales | Sin definir | 5 + frase estampada |
| Artesanos de ejemplo | Tarjetas dibujadas | 4, cada uno con su precio, plazo y calificación |
| Métodos de pago | Un recuadro de tarjeta | Tarjeta, PSE y Nequi (simulados) |
| Estados del pedido | 4 dibujados | 5 con línea de tiempo |
| Pantallas del artesano | 1 (panel) | 6 |
| Funciona en celular y escritorio | No (papel) | Sí |

## 1. Pantallas del cliente

| Pantalla | En la cartelera | Ahora |
|---|---|---|
| Inicio | Propuesta de valor y botón | Frase principal, cinta de texto en movimiento, collage de colores y accesos al diseño |
| Cuenta | Correo, contraseña, Google y "Soy artesano" | Validación de correo y de contraseña (mínimo 6 caracteres), conserva lo escrito si hay error, entra como cliente o artesano |
| Diseñador | Campos dibujados | Vista previa SVG que cambia con cada opción, medidas con deslizadores, frase estampada y precio "desde" en vivo |
| Elegir artesano | Tarjetas fijas | Orden por calificación, precio o plazo; cada artesano muestra su precio calculado |
| Datos de envío | Campos dibujados | Validación de cada campo y regreso al resumen si se vino a editar |
| Resumen | Prenda, dirección y total | Opción de entregar retazos con descuento, casilla de términos, enlaces para editar diseño o dirección |
| Pago | Campos dibujados | Tarjeta, PSE o Nequi con validación, pago rechazado simulado, reintento, cambio de método o vuelta al resumen |
| Recibo | Pedido confirmado | Sello "PAGADO", número de pedido y botón al seguimiento |
| Seguimiento | 4 estados dibujados | Línea de tiempo con 5 estados, guía de envío copiable, calificación al recibir y tarjeta de retazos |
| Recolección de retazos | Pantalla opcional | Se programa después desde el seguimiento (no obliga a pasar por ahí) |
| Mis pedidos | No existía | Lista de pedidos del cliente con su estado |

## 2. Panel del artesano (de 1 a 6 pantallas)

| Pantalla | Qué hace |
|---|---|
| Panel | Pedidos nuevos, pedidos en proceso, ingresos del mes, calificación y entregas de la semana |
| Pedidos | Filtros por estado |
| Detalle del pedido | Medidas, notas y detalles; el artesano define el plazo y cambia el estado (aceptar, confeccionar, despachar con guía, entregar) |
| Guías | Crear la guía al despachar y ver todas en un solo lugar |
| Reseñas | Promedio, distribución y respuesta a cada reseña |
| Mi taller | Disponibilidad, plazo habitual y porcentaje sobre el precio base; los clientes lo ven al instante |

## 3. Correcciones de flujo (revisión de la cartelera)

1. Después de diseñar la prenda se elige al artesano.
2. Desde la elección de artesano y desde el resumen se puede editar el diseño sin perder los datos.
3. Desde el resumen se puede editar la dirección y se vuelve al resumen.
4. Si el pago falla, se puede intentar de nuevo, cambiar de método o volver al resumen.
5. El recibo lleva siempre al seguimiento.
6. Entregar retazos no obliga a pasar por la recolección: se programa después.
7. El cambio de estado del artesano actualiza el seguimiento del cliente.

## 4. Cómo funciona por dentro

- Una sola página en HTML, CSS y JavaScript, sin servidor ni frameworks.
- Los datos y pedidos se guardan en el navegador (`localStorage`). Cliente y artesano comparten el mismo estado y una segunda pestaña se actualiza sola.
- Precio = prenda base × factor del artesano + tela + detalles + frase estampada. Envío fijo y descuento por retazos.
- Responsive: barra de pestañas abajo en celular y menú lateral para el artesano en escritorio. Sin scroll horizontal a 390 px.
- Modo claro y oscuro automático y animaciones que respetan "reducir movimiento".
- Publicado con GitHub Pages. Detalle técnico en `docs/ARQUITECTURA.md`.

## 5. Evolución del diseño

| Versión | Estilo | Qué cambió |
|---|---|---|
| v0.1 | Cartelera | Wireflow en baja fidelidad |
| v0.2 | "Colcha de retazos" | Primer prototipo funcional, colores saturados |
| v0.3 | Fanzine / collage contracultural | Paleta apagada, bordes gruesos, sombras duras, textura de papel, tipografías Archivo, Work Sans y Special Elite, contraste AA verificado, frase estampada |
| v0.4 | Prendas realistas | Costuras, cuellos y mangas con forma, pliegues, sombra suave, texturas de tela más creíbles (algodón, lino, dril, retazos con puntadas), botones, bolsillos y detalles dibujados con más cuidado |

## 6. Errores encontrados y corregidos durante las pruebas internas

- Una pantalla no cargaba la lista de artesanos por pasar mal los datos del diseño.
- Los precios se partían en dos líneas.
- El botón fijo tapaba contenido en escritorio.
- El valor de dinero se salía de la tarjeta en celular.
- El bordado se encimaba con la frase estampada.
- El texto "+$" perdía contraste dentro de las opciones seleccionadas.
- La página salía en blanco en GitHub Pages cuando faltaban las carpetas `css/` y `js/`; ahora muestra un aviso.

## 7. Documentación y repositorio

README, PROTOTIPO, CHANGELOG, CONTRIBUTING, licencia MIT, `docs/` (arquitectura, diseño, pruebas, backlog, cambios, exposición) y plantillas de Issues y Pull Requests en `.github/`.

## 8. Lo que todavía no existe

Servidor y base de datos, pago real, chat entre cliente y artesano, mapa de puntos de recolección y pruebas de usabilidad con personas externas registradas en `docs/PRUEBAS.md`. Están en `docs/BACKLOG.md` como siguiente ciclo.
