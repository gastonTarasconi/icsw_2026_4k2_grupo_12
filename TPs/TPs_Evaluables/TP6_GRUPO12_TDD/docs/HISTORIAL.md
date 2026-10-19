# Historial de avances — TP6 EcoHarmony Park

Historia: **Inscribirme a actividad** (Grupo 12). Registramos el trabajo realizado, los resultados observados y lo que todavía falta. Las evidencias de TDD que se conservaron se detallan en [CICLOS_TDD.md](CICLOS_TDD.md).

## 18/10/2026 — Base y primer caso de inscripción (registro original del equipo)

- Partimos de un catálogo con términos por actividad y una estructura React, Express y SQLite.
- Se creó el servicio mínimo para inscribir a una persona en Tirolesa con datos válidos, utilizando un repositorio de prueba en memoria y un código de confirmación.
- Resultado registrado: **5 PASS, 18 TODO**.
- Quedó propuesto unificar el identificador de los nombres de tests como `Inscribirme_a_Actividad`. **Esa convención propuesta no está aplicada en todos los nombres actuales**; los archivos todavía incluyen `test_InscribirmeActividad_...`.
- El registro inicial marcaba el refactor del ciclo 1 como pendiente. No lo damos por realizado sin evidencia.

## 18/10/2026 — Ciclo de cupos completo

- Se escribió una prueba que intenta inscribir a una persona cuando los diez cupos de Tirolesa ya están ocupados.
- **RED:** la operación fue aceptada incorrectamente. Resultado: **1 FAIL, 5 PASS, 18 TODO**.
- **GREEN:** se implementó consulta de turno, recuento de participantes y rechazo por cupo. Resultado: **6 PASS, 18 TODO**.
- **REFACTOR:** se extrajo `contarCuposOcupados()` y se verificó nuevamente **6 PASS, 18 TODO**.
- Las salidas registradas están transcritas en `CICLOS_TDD.md`.

## 18/10/2026 — Validaciones de negocio

- Se amplió `backend/tests/inscribirmeActividad.test.js` con casos positivos, negativos y parametrizados para edades, DNI, talles, términos, horarios, días de cierre, anticipación, grupos, cupos y superposiciones.
- Se implementaron las validaciones necesarias en el servicio.
- Resultado observado: **44 PASS, 18 TODO**. La secuencia individual RED/REFACTOR de todos estos casos **no está documentada**; se registra como ampliación de batería, no como 40 ciclos de TDD evidenciados.

## 18/10/2026 — Integración y aplicación web

- Se incorporaron rutas y repositorio de inscripciones con SQLite, formulario de participantes y selección de turnos/cupos en React.
- Se agregaron cinco pruebas de integración en `backend/tests/integracionInscripciones.test.js`.
- Se incorporó una pantalla de confirmación con código de inscripción, QR por participante y vista previa de correo **simulado**.
- Se reorganizó la presentación de los términos específicos para mostrarlos bajo demanda, con aceptación obligatoria.
- Se ensayó una inscripción en la interfaz usando un reloj local de demostración. Se observó la pantalla de confirmación y el QR; no se probó entrega de correo real ni lectura de QR en puerta.
- Resultado final comprobado dentro del repositorio clonado: **49 PASS, 18 TODO, 0 FAIL**, y `npm.cmd run build` completó correctamente.

## 18/10/2026 — Publicación de avance al repositorio grupal

- Se clonó el repositorio oficial y se creó la rama `feature/tp6-inscripciones-tdd`, sin alterar `main`.
- Se copiaron únicamente fuentes, pruebas y archivos de dependencias; no se incluyeron `node_modules`, bases SQLite de prueba, respaldos o instaladores temporales.
- Se validaron las pruebas y la compilación en esa copia.
- Se creó el commit **`49d1959`**: `TP6: implementar inscripciones, validaciones, pruebas y QR`.
- La rama se publicó en GitHub. El comando posterior `git push -u origin feature/tp6-inscripciones-tdd` devolvió `Everything up-to-date`.

## Próximos pasos

1. Revisar con el equipo la rama y preparar un Pull Request sin fusionar automáticamente con `main`.
2. Aclarar con el PO los importes (subtotales/total) de la confirmación de **inscripciones**; no reutilizar los precios de compra de entradas.
3. Definir y probar si el correo debe enviarse realmente o si se admite una simulación; incluir el detalle de participantes y QR solicitado.
4. Verificar las reglas en SQLite ante solicitudes simultáneas y ausencia de escrituras parciales cuando se rechaza una inscripción.
5. Revisar las cuatro actividades y el diseño responsive, resolver o justificar los `test.todo` pendientes y documentar evidencia TDD genuina.
6. Revisar los avisos de seguridad de dependencias antes de la entrega.
