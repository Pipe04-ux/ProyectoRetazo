# Arquitectura del prototipo

Aplicación de una sola página en HTML, CSS y JavaScript puro. No usa frameworks, módulos ni servidor, así que funciona abriendo `index.html` o con GitHub Pages.

## Archivos
| Archivo | Qué hace |
|---|---|
| `index.html` | Punto de entrada. Carga tipografías, `css/styles.css` y los tres scripts en este orden: `data.js`, `garment.js`, `app.js`. Si faltan archivos muestra un aviso. |
| `css/styles.css` | Diseño con variables (tokens), modo claro y oscuro, y adaptación a celular y escritorio. |
| `js/data.js` | Datos de ejemplo, precios, estados del pedido y estado guardado en `localStorage`. |
| `js/garment.js` | Dibuja la prenda en SVG según el diseño (tipo, tela, color, medidas, detalles y frase). |
| `js/app.js` | Rutas, pantallas y acciones de cliente y artesano. |

## Estado compartido
Todo vive en el objeto global `R` (`R.S` es el estado). Se guarda en `localStorage` con la clave `retazo-proto-v3`. Si cambia la estructura de los datos, se sube el número de la clave y todos los navegadores arrancan limpios.

Cliente y artesano leen el mismo pedido. Cuando el artesano cambia el estado (`R.setEstado`), el cliente lo ve en su seguimiento. Una segunda pestaña se actualiza con el evento `storage`.

## Rutas (hash)
Cliente: `#inicio`, `#login`, `#disenar`, `#artesanos`, `#envio`, `#resumen`, `#pago`, `#recibo`, `#seguimiento`, `#recoleccion`, `#pedidos`.
Artesano: `#a-panel`, `#a-pedidos`, `#a-pedido`, `#a-guias`, `#a-resenas`, `#a-taller`.

## Cómo se dibuja la pantalla
`render()` vuelve a dibujar toda la vista actual desde el estado; `rerender()` lo hace conservando el scroll. Los eventos se manejan por delegación con atributos:

| Atributo | Evento |
|---|---|
| `data-a="accion"` | clic |
| `data-in="campo"` | escribir |
| `data-ch="campo"` | cambio |
| `data-f="formulario"` | envío |

## Precios
`precio = prenda base × factor del artesano + tela + detalles + frase estampada (10.000)`. Envío: 9.900. Descuento por entregar retazos: 8.000. Función: `R.precio` en `js/data.js`.

## Pago de prueba
- Tarjeta que empieza por `0000`: se rechaza.
- `4242 4242 4242 4242`: se aprueba.
- PSE y Nequi: simulados.

## Cómo agregar algo
- **Nueva prenda:** una entrada en `R.PRENDAS` (`data.js`) y su trazo en `PATHS` (`garment.js`).
- **Nueva tela o detalle:** `R.TELAS` o `R.DETALLES`; si cambia el dibujo, también `garment.js`.
- **Nueva pantalla:** una función `vNombre` en `app.js`, su ruta en la tabla de rutas y un enlace desde otra pantalla.

## Límites actuales
Sin servidor, sin pago real y sin chat. Los datos viven en el navegador de cada persona.
