# Retazo — Prototipo, video y pruebas de usabilidad

**Nombre temporal:** *Retazo* (un retazo es el sobrante de tela; la idea es darle una segunda vida).
Alternativas por si no convence: *Puntada*, *Hilvana*, *A Medida*.

**Objetivo del primer prototipo:** no ser perfecto. Su trabajo es mostrar el recorrido principal para que una persona externa lo use y nos ayude a **encontrar fallos y puntos de fricción**. Con eso se mejora el prototipo final.

---

## Paso 2 — Prototipo en cartelera (baja fidelidad)

Se dibuja a mano en una cartelera, en formato de wireflow: cada pantalla es un recuadro y las flechas muestran a dónde lleva cada botón. Se recomienda dibujar las pantallas con formato de celular (móvil primero) y una versión de escritorio solo para la pantalla 3 si alcanza el espacio.

### Pantallas del prototipo (11) — en orden lógico, sin saltar pasos

Primero cuenta, luego diseño, artesano, datos de envío, resumen, pago y recibo. Nada se cobra antes del paso 7.

| # | Pantalla | Qué debe mostrar | Qué queremos probar |
|---|---|---|---|
| 1 | **Inicio** | Propuesta de valor, botón "Diseña tu prenda", ejemplos de artesanos | ¿Entienden en 5 segundos qué es y en qué se diferencia? |
| 2 | **Iniciar sesión / crear cuenta** | Correo, contraseña, Google, acceso "Soy artesano" | ¿Les molesta iniciar sesión antes de diseñar? |
| 3 | **Diseñador de prenda** | Tipo, tela, color, medidas, detalles, vista previa | ¿Es claro cómo personalizar? |
| 4 | **Elegir artesano** | Tarjetas con calificación, precio y tiempo | ¿Entienden cómo comparan y por qué eligen? |
| 5 | **Datos de envío** | Nombre, celular, ciudad, barrio, dirección | ¿Piden datos de más? ¿Está claro dónde llega? |
| 6 | **Resumen y confirmar pedido** | Prenda, dirección, material reciclado, total | ¿Saben que aún no han pagado? |
| 7 | **Pago (inscribir tarjeta)** | Método, número, nombre, vencimiento, CVV, total | ¿Se siente seguro? ¿Entienden el total? |
| 8 | **Recibo** | Pedido confirmado, número, total, dirección | ¿Queda claro que el pedido ya está hecho? |
| 9 | **Seguimiento** | Aceptado, confeccionando, en camino, entregado | ¿Saben en qué paso va su pedido? |
| 10 | **Recolección de material** (opcional) | Qué se entrega, cantidad, cómo y cuándo | ¿Entienden qué pueden entregar? |
| 11 | **Panel del artesano** | Pedidos nuevos, precio y plazo, estados | ¿Entiende que tiene autonomía? |

### Flujo (wireflow)

```
Cliente:
[1 Inicio] -> [2 Sesión] -> [3 Diseñador] -> [4 Artesano] -> [5 Envío]
   -> [6 Resumen] -> [7 Pago] -> [8 Recibo] -> [9 Seguimiento] - - -> [10 Recolección]

Artesano:
[2 Sesión: "Soy artesano"] -> [11 Panel] -> aceptar pedido -> actualiza el estado en [9 Seguimiento]
```

Flecha continua = paso obligatorio. Flecha punteada = paso opcional.

### Qué dejar fuera por ahora
Verificación real de usuarios, pasarela de pago real, chat, reseñas detalladas, buscador y catálogo completo. Eso se simula con un botón o texto fijo.

---

## Paso 3 — Video con el prototipo y el recorrido

Duración sugerida: 3 a 5 minutos.

**Guion:**
1. **Presentación (30 s):** nombre, problema que resuelve y la idea en dos frases.
2. **Recorrido guiado del equipo (1 min):** se muestra la cartelera pantalla por pantalla, en el orden del flujo.
3. **Prueba con una persona externa (2 a 3 min):** la persona usa el prototipo mientras **piensa en voz alta** (método *Think Aloud*). El equipo no ayuda ni explica.
4. **Cierre (30 s):** qué fallos aparecieron y qué se va a mejorar.

**Consejos:** grabar en horizontal, buen audio y que se vea claro el dedo o puntero sobre la cartelera.

### Tareas para la persona de prueba
Se le dan tareas, no instrucciones de dónde hacer clic:

1. "Imagina que quieres una camisa azul de manga larga. Diseña la tuya."
2. "Escoge a la persona que te la va a confeccionar."
3. "Tienes ropa vieja que ya no usas. Averigua qué puedes hacer con ella en esta página."
4. "Revisa cómo va tu pedido."
5. (Opcional, rol artesano) "Eres sastre: acepta un pedido nuevo."

### Plantilla para registrar fallos

| Tarea | ¿La completó? | Tiempo | Dónde se confundió | Qué dijo en voz alta | Gravedad (1-3) | Mejora propuesta |
|---|---|---|---|---|---|---|
| | | | | | | |

**Tip:** con 3 a 5 personas distintas ya aparecen la mayoría de los problemas importantes.

---

## Paso 4 — Prototipo funcional (con los cambios)

**Estado: construido (v0.2).** Es una aplicación HTML, CSS y JavaScript, responsive (móvil primero), sin servidor. Los datos de ejemplo se guardan en `localStorage`. Se publica con **GitHub Pages**.

### Mapa de pantallas

```
Cliente:
[Inicio] -> [Cuenta] -> [Diseñador] -> [Artesanos] -> [Envío] -> [Resumen] -> [Pago] -> [Recibo] -> [Seguimiento]
                                          ^  editar diseño ------+              | pago falla: reintentar
                                          +------ editar dirección (Resumen -> Envío -> Resumen)
[Seguimiento] - - -> [Recolección de retazos] (opcional, se programa cuando el cliente quiera)
[Seguimiento] -> [Calificar] (cuando el pedido está entregado)
[Mis pedidos] -> [Seguimiento]

Artesano:
[Panel] -> [Pedidos] -> [Detalle del pedido: aceptar / confeccionar / guía / entregar]
[Guías] [Reseñas] [Mi taller]
Cada cambio de estado actualiza el [Seguimiento] del cliente.
```

### Qué se agregó frente al prototipo de cartelera

| Área | Mejora |
|---|---|
| Diseñador | Vista previa de la prenda que cambia con tipo, tela, color, medidas y detalles. Precio "desde" en vivo. |
| Artesanos | Ordenar por calificación, precio o plazo. Cada artesano muestra su propio precio. |
| Pago | Tarjeta, PSE y Nequi, validación de campos y simulación de pago rechazado con opción de reintentar. |
| Seguimiento | Línea de tiempo con 5 estados, guía de envío con número copiable y calificación al recibir. |
| Retazos | Opcional en el resumen, con descuento. Se programa después desde el seguimiento. |
| Artesano: pedidos | Filtros por estado, detalle con medidas y notas, plazo definido por el artesano. |
| Artesano: guías | Crear la guía al despachar y ver todas las guías en una sola pantalla. |
| Artesano: reseñas | Promedio, distribución y respuesta a cada reseña. |
| Artesano: taller | Disponibilidad, plazo habitual y porcentaje sobre el precio base. Los clientes lo ven al instante. |

### Cómo probar el flujo completo en 3 minutos

1. En **Cliente**, toca "Diseña tu prenda", entra con cualquier correo válido y una contraseña de 6 caracteres.
2. Diseña, elige artesano, llena el envío, activa o no los retazos, marca la casilla y confirma.
3. En el pago usa una tarjeta que empiece por `0000` para ver el rechazo y luego `4242 4242 4242 4242`.
4. En el seguimiento toca "Abrir este pedido como artesano": acepta, empieza a confeccionar, despacha con guía y marca entregado.
5. Vuelve a **Cliente**, abre el pedido, mira la guía y califica.

### Reparto de roles sugerido para 4 personas

1. **Diseño y cartelera:** mantener el sistema visual y los wireframes.
2. **Guion, video y pruebas:** coordinar a las personas de prueba (ver `docs/PRUEBAS.md`).
3. **Registro de fallos:** convertir cada hallazgo en un Issue con etiqueta y gravedad.
4. **Repositorio y código:** ramas, Pull Requests y GitHub Pages.

Todos participan en el código; cada quien trabaja en su rama (`feat/...`, `fix/...`) y se une con Pull Request.


## Actualización visual v0.3
Look contracultural (fanzine / collage), paleta apagada, contraste AA verificado y nueva opción de frase estampada en el diseñador (+$10.000). El flujo y las pantallas no cambian.
