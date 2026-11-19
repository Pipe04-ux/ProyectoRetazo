# Guía de la exposición

Equipo: Santiago Rodriguez, David Fonseca, Felipe Pinilla y Lucy Lizeth Rodriguez.
Material: presentación en diapositivas, demo en vivo (GitHub Pages), video de la cartelera y este repositorio como respaldo.

## Antes del día
1. **Una semana antes:** repartir las partes (tabla de abajo) y hacer una prueba con personas reales usando `docs/PRUEBAS.md`. Anotar solo lo que pasó de verdad.
2. **Dos días antes:** ensayar completa, con cronómetro y con el celular. Mínimo dos veces.
3. **El día anterior:** abrir la demo, tocar "Reiniciar demo", revisar que carga con datos del celular y con el wifi del salón. Cargar la presentación y el video también sin conexión.
4. **Una hora antes:** abrir la demo en el celular y en el computador, y tener la pestaña del repositorio abierta.

## Orden de las diapositivas

| # | Diapositiva | Quién (sugerido) | Tiempo |
|---|---|---|---|
| 1 | Portada | Santiago | 0:30 |
| 2 | Contenido | Santiago | 0:15 |
| 3 | Introducción al problema | Santiago | 1:00 |
| 4 | Propuesta | David | 1:15 |
| 5 | Flujo del modelo (cartelera) | David | 1:00 |
| 6 | Del prototipo de cartelera al funcional | David | 1:30 |
| 7 | Arquitectura: GitHub y video | Lucy | 1:00 |
| — | **Demo en vivo** (en el celular) | Felipe | 3:00 |
| — | Evidencia y siguientes pasos | Lucy | 1:00 |
| 8 | Gracias y preguntas | Todos | resto |

Total: unos 10 minutos. Si les dan menos, reduzcan la demo a 2 minutos y las diapositivas 2 y 5 a una frase cada una.

## Qué decir en cada parte
- **Problema:** desperdicio textil, tallas estándar que no se ajustan y artesanos locales sin herramientas digitales para cotizar. Una frase con un dato propio o de una fuente que puedan citar.
- **Propuesta:** tres ideas: el cliente diseña, el artesano decide su precio y plazo, y los retazos se reutilizan. Se hace bajo pedido, así que no hay inventario sobrante.
- **Flujo:** recorrer la imagen de izquierda a derecha: cuenta, diseño, artesano, envío, resumen, pago, recibo, seguimiento y recolección. Mencionar que es el prototipo de cartelera.
- **Cambios (diapositiva 6):** leer la columna derecha de arriba abajo. Mensaje central: "pasamos de 11 pantallas dibujadas a 17 pantallas que funcionan, y corregimos el flujo después de revisarlo".
- **Arquitectura:** HTML, CSS y JavaScript sin servidor, datos en el navegador, publicado en GitHub Pages. Mostrar el repositorio: carpetas, `docs/`, historial de commits y los Issues.
- **Evidencia:** decir solo lo que sea real. Si hicieron pruebas, mostrar cuántas personas, qué falló y qué corrigieron. Si no, decir "el plan de pruebas está listo en `docs/PRUEBAS.md` y es nuestro siguiente paso".
- **Siguientes pasos:** chat entre cliente y artesano, mapa de puntos de recolección, pago real y base de datos.

## Guion de la demo (3 minutos, en el celular)
1. Entrar con cualquier correo válido y una contraseña de 6 o más caracteres.
2. En **Diseñar**: cambiar prenda, tela y color; escribir una frase estampada. Señalar que el precio cambia al instante.
3. **Elegir artesano:** ordenar por precio o calificación.
4. **Envío y resumen:** llenar los datos, activar los retazos y mostrar el descuento. Marcar los términos.
5. **Pago:** tarjeta `0000 0000 0000 0000` (rechazada), reintentar con `4242 4242 4242 4242` (aprobada).
6. En el seguimiento, tocar **Abrir este pedido como artesano**: aceptar, confeccionar, despachar con guía y entregar.
7. Volver a **Cliente**: el seguimiento ya está actualizado. Calificar el pedido.

**Plan B:** si la demo falla, usar el video. Si falla el internet, abrir `index.html` desde el computador.

## Reglas para que salga bien
- Cada integrante habla su parte sin leer la diapositiva.
- La demo se ensaya con el mismo celular que se usará.
- Antes de empezar, tocar **Reiniciar demo**.
- Nadie dice algo que no esté hecho. Lo que falta se presenta como siguiente ciclo.
- Cada quien conoce todo el proyecto: pueden preguntarle a cualquiera.

## Preguntas que pueden hacer
| Pregunta | Respuesta honesta |
|---|---|
| ¿En qué se diferencia de Shein o Temu? | Se produce bajo pedido, el cliente diseña y el artesano fija su precio. No incentiva comprar más. |
| ¿Cómo se paga realmente? | En el prototipo el pago es simulado. En la siguiente versión se integraría una pasarela real. |
| ¿Dónde se guardan los datos? | En el navegador de cada persona. No hay servidor todavía. |
| ¿Qué pasa si el artesano no cumple el plazo? | Hoy no lo resolvemos. Es un riesgo abierto en el README: faltan reglas de calidad y trazabilidad. |
| ¿Cómo se garantiza la calidad? | Con calificaciones y reseñas visibles para el cliente. Falta definir criterios más estrictos. |
| ¿Cómo funciona la recolección de retazos? | El cliente lo marca en el pedido y programa la entrega. El mapa de puntos de recolección es un siguiente paso. |
| ¿Qué hicieron en cada paso del taller? | Idea de negocio, cartelera, video y prototipo funcional. Todo está documentado en el repositorio. |
| ¿Cómo trabajaron en equipo? | Con GitHub: ramas, Pull Requests, Issues y guía en `CONTRIBUTING.md`. |
| ¿Cómo ganaría dinero? | Comisión por pedido completado, suscripción opcional para artesanos y una línea con material reciclado. |
| ¿Qué cambiaron después de la cartelera? | Está en `docs/CAMBIOS.md` y en la diapositiva 6. |
