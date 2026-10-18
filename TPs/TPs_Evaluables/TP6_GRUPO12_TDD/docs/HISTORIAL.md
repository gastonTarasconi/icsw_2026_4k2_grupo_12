# Historial de avances

Anotamos brevemente qué hicimos, para qué y qué sigue. La evidencia de Red, Green y Refactor se conserva en [CICLOS_TDD.md](CICLOS_TDD.md).

## 18/10/2026 — Primer caso de inscripción

- Partimos de una base con catálogo, términos por actividad, React, Express y SQLite.
- Pasamos a verde el primer test: inscribir a una persona en Tirolesa con datos válidos. Creamos un servicio mínimo que guarda en el repositorio en memoria y devuelve un código de confirmación.
- Ejecutamos las pruebas: 5 aprobadas y 18 pendientes. Todavía faltan las validaciones y el flujo completo de inscripción.
- Acordamos usar `Inscribirme_a_Actividad` como identificador de la historia en los nombres de tests. Falta actualizar el nombre existente y sus referencias.
- Próximo paso propuesto: revisar el refactor del primer ciclo y luego escribir un test que rechace un turno inexistente sin guardar la inscripción.

En los próximos avances agregaremos entradas cortas con el cambio realizado, su verificación y el siguiente paso.
