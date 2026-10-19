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


---

## Actualización del 19/10/2026 — Continuación del desarrollo

Los apartados anteriores registran el estado del proyecto al 18/10/2026. Esta actualización incorpora los avances posteriores y reemplaza el estado de pendientes registrado anteriormente, sin borrar el historial original.

### Confirmación con resumen y códigos QR

Se completó un ciclo TDD para preparar la confirmación de una inscripción con un resumen y un identificador QR por participante.

- RED `d4c5ce3`: prueba de confirmación que inicialmente falló.
- GREEN `d82bf95`: implementación del resumen y los identificadores QR.
- REFACTOR `f8e7d9d`: separación de la preparación de la confirmación en un servicio independiente.

Resultado registrado: 50 pruebas aprobadas, 18 `test.todo` y compilación exitosa.

### Incorporación del servicio de correo

Se integraron los cambios del commit `3805c12`, que incorporaron:

- Preparación de mensajes de confirmación.
- Envío simulado de correos.
- Envío opcional mediante Gmail y SMTP.
- Nuevas pruebas del correo y su presentación.
- Actualización de la interfaz de confirmación.

Resultado registrado: 59 pruebas aprobadas, 18 `test.todo` y compilación exitosa.

La integración se realizó mediante `git pull --ff-only`, sin modificar la rama `main`.

Las pruebas de SMTP utilizan un transporte controlado y no acreditan la recepción real de mensajes en Gmail.

### Ciclo TDD — Formato de correo electrónico

Se detectó que el sistema aceptaba una inscripción con un correo electrónico inválido.

- RED `64e9547`: se agregó una prueba que esperaba HTTP 400, pero recibió HTTP 201.
- GREEN `8a858d3`: se implementó la validación del formato antes de guardar.
- REFACTOR `d449989`: se extrajo la validación a una función independiente.

Resultado: 60 pruebas aprobadas, 18 `test.todo` y compilación correcta.

### Corrección de seguridad

Commit `fd6b160`.

Se retiraron las credenciales del archivo público `backend/.env.example` y se dejó el modo simulado como configuración predeterminada.

Esta corrección no constituye un ciclo TDD.

La contraseña de aplicación anteriormente publicada debe ser revocada por el propietario de la cuenta, porque sigue apareciendo en el historial anterior de Git.

### Ciclo TDD — Correo electrónico obligatorio

Se identificó que el backend no rechazaba de manera consistente las inscripciones sin correo electrónico.

Se incorporaron cuatro pruebas para:

- Correo ausente.
- Correo nulo.
- Correo vacío.
- Correo compuesto solamente por espacios.

Commits:

- RED `1ef0745`: las cuatro pruebas fallaron por mensajes incorrectos o errores técnicos.
- GREEN `1f13159`: se agregó la validación de obligatoriedad antes de guardar.
- REFACTOR `4d64ae5`: se separaron las funciones `correoVacio()`, `formatoCorreoValido()` y `validarCorreo()`.

Resultado comprobado:

```text
Test Suites: 10 passed, 10 total
Tests:       18 todo, 64 passed, 82 total
```

Las pruebas no registraron fallos y el frontend compiló correctamente.

### Actualización de la documentación

Se actualizaron los documentos para reflejar el estado actual del proyecto:

- `9d16585`: ampliación de `CICLOS_TDD.md` con los ciclos documentados.
- `a5c5ad0`: actualización del README con funcionalidades, instalación, ejecución, pruebas y limitaciones.
- `135f243`: actualización de la matriz de trazabilidad con los criterios y las 64 pruebas aprobadas.

La documentación distingue pruebas aprobadas, casos `test.todo`, ciclos TDD demostrados y funcionalidades pendientes de verificación.

### Estado del proyecto al 19/10/2026

Última ejecución automatizada registrada:

- 64 pruebas aprobadas.
- 0 pruebas fallidas.
- 18 casos `test.todo` sin ejecutar.
- 10 suites aprobadas.
- Compilación del frontend exitosa.

Los commits se publicaron en la rama `feature/tp6-inscripciones-tdd`.

Estos resultados demuestran que las pruebas existentes pasan. No equivalen a una validación completa de todos los requisitos del Product Owner.

## Pendientes de verificación final

1. Revisar los 18 casos `test.todo` para distinguir pruebas ya cubiertas de casos realmente faltantes.
2. Probar solicitudes concurrentes contra SQLite, especialmente cuando queda un único cupo.
3. Revisar la información personal expuesta por la consulta de inscripciones.
4. Probar manualmente los recorridos de las cuatro actividades y su presentación en distintos tamaños de pantalla.
5. Comprobar, con autorización y credenciales seguras, el envío real del correo si es exigido para la entrega.
6. Revisar la generación de QR y aclarar si la lectura y validación de acceso pertenecen al alcance de esta historia.
7. Confirmar los términos particulares pendientes de aprobación y la interpretación de los subtotales y total mencionados por la FAQ.
8. Revisar dependencias y avisos de seguridad.
9. Coordinar con el grupo la revisión de la rama y su eventual integración a `main`.

No se considera completada una verificación que todavía no haya sido ejecutada.
