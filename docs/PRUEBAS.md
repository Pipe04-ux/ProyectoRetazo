# Pruebas de usabilidad — prototipo funcional

Método: **pensar en voz alta**. La persona usa el prototipo y el equipo no la ayuda. Con 3 a 5 personas aparecen la mayoría de los problemas.

## Preparación
- Abrir el enlace de GitHub Pages en un celular.
- Tocar "Reiniciar demo" antes de cada persona.
- Grabar pantalla y voz (con permiso de la persona).

## Tareas (no se dice dónde tocar)
1. "Quieres un vestido de tu color favorito. Diséñalo."
2. "Elige a la persona que lo va a confeccionar."
3. "Tienes tela vieja en casa. Averigua qué puedes hacer con ella."
4. "Paga tu pedido." (primero con una tarjeta que empiece por 0000 y luego con 4242 4242 4242 4242)
5. "Revisa cómo va tu pedido y dónde está."
6. Rol artesano: "Eres sastre. Acepta el pedido, avísale al cliente que ya salió y ponle la guía."
7. "Tu pedido llegó. Cuéntale al artesano cómo te quedó."

## Registro de fallos

| Tarea | ¿La completó? | Tiempo | Dónde se confundió | Qué dijo en voz alta | Gravedad (1-3) | Mejora propuesta | Issue |
|---|---|---|---|---|---|---|---|
| | | | | | | | |

Cada fila con gravedad 2 o 3 se convierte en un Issue de GitHub y se corrige en una rama.
# Registro de Pruebas y Verificación — Versión v0.3
# Registro de Pruebas y Verificación — Versión v0.3

## 1. Verificación interna del equipo (Recorrido funcional)
- **Responsables:** Santiago Rodríguez, David Fonseca, Felipe Pinilla y Lucy Lizeth.
- **Entorno:** Navegador web sobre la versión desplegada (`https://pipe04-ux.github.io/ProyectoRetazo/`) con persistencia en `localStorage`.
- **Alcance:** Validación técnica y de flujo de extremo a extremo antes de la entrega del Paso 4.

| ID | Flujo verificado | Estado técnico | Observación real del equipo |
| :--- | :--- | :--- | :--- |
| V-01 | Diseño de vestido (tipo, tela, color, medidas, detalles y frase estampada) | Funcional | El flujo de configuración responde bien, pero la vista previa de las prendas y las imágenes son aún esquemáticas y necesitan acercarse a una representación más real. |
| V-02 | Selección de artesano autónomo (visualización de precio y plazo) | Funcional | Muestra tarifas y plazos sin fallos; falta integrar fotografías reales de los talleres y prendas confeccionadas (planificado en backlog). |
| V-03 | Formulario de envío y validación de pago (tarjeta `0000` rechazada y `4242 4242 4242 4242` aprobada) | Funcional | Ambas validaciones (rechazo y aprobación) operan correctamente sin bloquear la navegación. |
| V-04 | Cambio a rol artesano, aceptación del pedido y registro de guía | Funcional | La transición de rol y la actualización del estado de la orden funcionan según lo esperado en `localStorage`. |
| V-05 | Regreso a rol cliente y consulta de seguimiento actualizado | Funcional | El cliente visualiza de inmediato el cambio de estado y el número de guía asignado. |
| V-06 | Módulo de recolección y reutilización de retazos y ropa vieja | Funcional | Cumple el flujo informativo y de registro, aunque requiere material visual más realista para ilustrar la recolección y reutilización. |

---

## 2. Hallazgos internos (Oportunidades de mejora detectadas)

### Hallazgo #1: Baja fidelidad visual en la representación de prendas e imágenes
- **Detectado por:** Equipo Retazo (revisión interna v0.3)
- **Gravedad:** 2 (Moderado — no bloquea el flujo técnico, pero reduce la confianza visual del comprador)
- **Qué pasó:** Aunque todo el recorrido de personalización y compra es funcional, las imágenes y la previsualización de las prendas se ven todavía como un prototipo básico y no muestran con suficiente realismo las texturas, cortes o acabados finales.
- **Solución propuesta (plan):** Reemplazar los recursos gráficos básicos por mockups realistas por tipo de prenda y tela, además de incorporar fotografías reales de trabajos en los perfiles de artesanos.

---

## 3. Plan de pruebas con usuarios externos (Pendiente)
- **Estado:** Pendiente de ejecución (primer bloque de `docs/BACKLOG.md`).
- **Muestra planificada:** 3 a 5 participantes externos (perfiles de cliente comprador y confeccionista/artesano).
- **Tareas planificadas:**
  1. Configurar un vestido personalizado con frase estampada.
  2. Seleccionar un artesano comparando tarifa y tiempo de entrega.
  3. Completar envío y simular pago con rechazo y aprobación.
  4. Cambiar al rol artesano, aceptar la orden y cargar número de guía.
  5. Verificar el cambio de estado desde la vista de cliente y ubicar la sección de retazos.

| ID | Participante / Perfil | Tarea evaluada | Resultado | Tiempo | Notas reales | Mejora propuesta |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| P-01 | [PENDIENTE] | Flujo completo cliente y artesano | [PENDIENTE] | [PENDIENTE] | [COMPLETAR: notas tras ejecutar prueba] | [PENDIENTE] |
| P-02 | [PENDIENTE] | Flujo completo cliente y artesano | [PENDIENTE] | [PENDIENTE] | [COMPLETAR: notas tras ejecutar prueba] | [PENDIENTE] |
| P-03 | [PENDIENTE] | Flujo completo cliente y artesano | [PENDIENTE] | [PENDIENTE] | [COMPLETAR: notas tras ejecutar prueba] | [PENDIENTE] |
 
