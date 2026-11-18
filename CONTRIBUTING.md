# Cómo trabajamos en el repositorio

Somos 4 integrantes. Para no pisarnos el trabajo usamos ramas y Pull Requests.

## Flujo en 5 pasos
1. **Crea un Issue** (o toma uno existente) que describa la tarea.
2. **Crea una rama** desde `main`: `feat/nombre-corto`, `fix/nombre-corto` o `docs/nombre-corto`.
3. **Haz commits pequeños** con mensaje claro (ver abajo).
4. **Abre un Pull Request** hacia `main` y enlaza el Issue (`Closes #12`).
5. **Otro integrante lo revisa** y lo une. Nadie une su propio PR.

## Mensajes de commit
Formato: `tipo: qué cambia`

| Tipo | Cuándo |
|---|---|
| `feat` | Nueva función o pantalla |
| `fix` | Corrección de un error |
| `style` | Solo diseño (CSS) |
| `docs` | Documentación |
| `test` | Pruebas o guion de pruebas |
| `chore` | Cosas de mantenimiento |

Ejemplos: `feat: agrega frase estampada al diseñador`, `fix: precio no se parte en dos líneas`.

## Antes de abrir un PR
- Abre `index.html` y recorre el flujo: diseñar → artesano → envío → pago → seguimiento.
- Revisa en pantalla de celular (390 px) y en escritorio.
- Si cambias precios, datos o rutas, actualiza `docs/ARQUITECTURA.md`.
- Si cambias colores o tipografías, actualiza `docs/DISENO.md` y revisa el contraste.
- Anota el cambio en `CHANGELOG.md`.

## Reparto sugerido (editable)
| Área | Archivos |
|---|---|
| Flujo del cliente | `js/app.js` (vistas del cliente) |
| Panel del artesano | `js/app.js` (vistas `a-*`) |
| Diseño y accesibilidad | `css/styles.css`, `docs/DISENO.md` |
| Datos, precios y pruebas | `js/data.js`, `docs/PRUEBAS.md` |
