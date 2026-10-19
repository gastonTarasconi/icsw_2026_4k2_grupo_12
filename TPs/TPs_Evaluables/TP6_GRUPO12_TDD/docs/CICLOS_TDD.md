# Registro de ciclos TDD

## Presentación del correo del 19/10/2026

RED ejecutado: `npm.cmd test --workspace backend -- --runTestsByPath tests/disenoCorreo.test.js`, cuatro casos fallidos porque el asunto no incluía la actividad. GREEN: plantilla HTML con paleta institucional, asunto y contenido dinámicos para las cuatro actividades, escape de datos ingresados, versión de texto y remitente visible Eco Harmony Park. La vista previa usa el mismo HTML con aislamiento mediante iframe. Regresión ejecutada: **59 passed, 18 todo**, ocho suites aprobadas y build correcto. No se envió un correo real durante esta verificación; la representación final en Gmail requiere una inscripción nueva de demostración.

## Incremento de correo del 19 de octubre de 2026

RED: `npm.cmd test --workspace backend -- --runTestsByPath tests/envioCorreo.test.js` dio **2 failed, 1 passed** antes de implementar el envío. Cero llamadas al transporte y ausencia de `correo.estado` causaron los fallos. El rechazo de inscripción inválida ya funcionaba; no se presenta como un RED nuevo.

GREEN: se inyectó el envío, se incorporó el simulador con bandeja en memoria y se devolvieron mensaje y estado a la interfaz. `npm.cmd test`: **53 passed, 18 todo**, seis suites aprobadas.

Segundo RED: `npm.cmd test --workspace backend -- --runTestsByPath tests/correoSmtp.test.js` falló por módulo `correoSmtp` inexistente, sin ejecutar los casos. GREEN: adaptador SMTP con transporte controlable, destinatario aceptado y adjuntos QR PNG, más configuración opcional para Gmail. Regresión: **55 passed, 18 todo**, siete suites aprobadas; build correcto. Las pruebas no se conectaron a Gmail. Recepción real pendiente de configuración y prueba manual.

Estas son transcripciones resumidas de ejecuciones realizadas, no capturas ni commits de las fases. No se afirma una fase REFACTOR independiente: no hubo una separación adicional después del GREEN.

Historia de usuario: **Inscribirme a actividad** (TP6, Grupo 12).

En este archivo distinguimos los ciclos **RED → GREEN → REFACTOR** que tienen salidas registradas de las ampliaciones de pruebas cuya secuencia completa no quedó documentada. Un `test.todo` no se considera ejecutado ni constituye evidencia de TDD. Los resultados corresponden a ejecuciones de Jest realizadas durante el desarrollo del 18/10/2026.

## Ciclo 1 — Inscripción individual válida en Tirolesa

### RED (registro original del equipo)

Prueba: `test_InscribirmeActividad_ActividadConCupo_Pasa`.

```sh
npm test --workspace backend -- --runTestsByPath tests/inscribirmeActividad.test.js
```

Salida registrada en el documento original:

```text
FAIL tests/inscribirmeActividad.test.js
Cannot find module '../src/servicios/inscripciones' from 'tests/inscribirmeActividad.test.js'
Tests: 1 failed, 1 total
```

**Motivo:** todavía no existía el servicio de inscripciones.

### GREEN (registro original del equipo)

Se creó `backend/src/servicios/inscripciones.js`. El servicio mínimo buscaba la actividad, generaba un código con `randomUUID()`, guardaba en un repositorio **en memoria** y devolvía la confirmación.

El documento original registra esta ejecución del 18/10/2026:

```sh
node --preserve-symlinks --preserve-symlinks-main node_modules/jest/bin/jest.js --config backend/package.json --runInBand
```

```text
Test Suites: 3 passed, 3 total
Tests:       18 todo, 5 passed, 23 total
```

El comando directo de Jest se utilizó en ese entorno para sortear un problema `EPERM` de resolución de rutas. Luego se pudo ejecutar `npm.cmd test` normalmente en Windows.

### REFACTOR

**Sin evidencia de ejecución específica en el registro inicial.** No se presenta como fase completada de este ciclo. La extracción de la función para contar cupos que figura en el ciclo 2 corresponde a otra funcionalidad.

## Ciclo 2 — Rechazar una inscripción de Tirolesa sin cupos

**Caso:** turno de Tirolesa de 10:00, capacidad 10; existen diez inscripciones previas de una persona cada una. Se intenta agregar otra persona con datos válidos. El resultado esperado es rechazar la operación y conservar las diez inscripciones.

Prueba incorporada: `test_InscribirmeActividad_ActividadSinCupo_Falla` en `backend/tests/inscribirmeActividad.test.js`.

### RED — Prueba antes de la validación

Se ejecutó:

```powershell
npm.cmd test
```

Resultado registrado:

```text
FAIL tests/inscribirmeActividad.test.js
  test_InscribirmeActividad_ActividadSinCupo_Falla

expect(received).rejects.toThrow()
Received promise resolved instead of rejected

Test Suites: 1 failed, 2 passed, 3 total
Tests:       1 failed, 18 todo, 5 passed, 24 total
```

**Motivo:** el servicio aceptó y guardó una inscripción aun cuando ya estaban ocupados los diez lugares. El sufijo `_Falla` nombra un caso de negocio rechazado; cuando la validación funciona, **Jest debe informar PASS** para esa prueba.

### GREEN — Validación mínima de cupos

Se modificó `backend/src/servicios/inscripciones.js` para buscar el turno, consultar las inscripciones existentes y sumar las cantidades de participantes del mismo día, horario y actividad. Si la nueva cantidad supera la capacidad del turno, el servicio devuelve un error sin guardar la inscripción.

Resultado de `npm.cmd test`:

```text
Test Suites: 3 passed, 3 total
Tests:       18 todo, 6 passed, 24 total
```

### REFACTOR — Extraer el cálculo de ocupación

Se separó el filtrado y la suma de participantes en `contarCuposOcupados()`. Se mantuvo la lógica de validación y el resultado de las pruebas.

Resultado de `npm.cmd test` tras refactorizar:

```text
Test Suites: 3 passed, 3 total
Tests:       18 todo, 6 passed, 24 total
```

**Estado del ciclo 2: RED, GREEN y REFACTOR comprobados con salidas registradas.**

## Ampliación posterior — Reglas de inscripción

Se agregaron pruebas parametrizadas y casos de inscripción válida e inválida: edades mínimas, DNI, nombre opcional, talles, términos, días cerrados, horarios, ventana de anticipación, cupos, participantes, superposición y turnos consecutivos. El servicio incorporó las validaciones correspondientes.

Salida comprobada con `npm.cmd test`:

```text
Test Suites: 3 passed, 3 total
Tests:       18 todo, 44 passed, 62 total
```

**Alcance de esta evidencia:** prueba la ejecución exitosa de la batería de tests tras implementar esas reglas. No se conservaron en estos documentos las salidas RED y REFACTOR individuales de cada caso, por lo que **no se afirma que sean 40 ciclos TDD documentados**.

## Integración con la aplicación

Se agregaron una ruta de inscripción, un repositorio con persistencia SQLite, un formulario en React, disponibilidad de turnos, confirmación en pantalla y generación visual de QR. El frontend muestra una **vista previa de correo simulado**; no se acreditó un envío real por correo ni una verificación del QR en el acceso.

Se incorporó `backend/tests/integracionInscripciones.test.js` con cinco pruebas adicionales. Ejecución en el repositorio clonado del grupo:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run build
```

Resultados registrados:

```text
Test Suites: 4 passed, 4 total
Tests:       18 todo, 49 passed, 67 total
```

El frontend compiló correctamente con Vite (`built in 2.26s`). Estas salidas demuestran regresión e integración probadas; **no documentan por sí solas nuevos ciclos RED → GREEN → REFACTOR**.

## Evidencias y trabajos todavía pendientes

- Conservar, si están disponibles, las capturas o salidas de terminal del ciclo 2; las transcripciones anteriores permiten reconstruir el resultado, pero no sustituyen capturas originales que no se hayan guardado.
- Desarrollar y registrar ciclos RED → GREEN → REFACTOR para próximos comportamientos, evitando afirmar etapas no ejecutadas.
- Revisar atomicidad y concurrencia de reservas, especialmente dos solicitudes sobre el último cupo; no hay evidencia de esa garantía en los resultados compartidos.
- Verificar correo, contenido completo de la confirmación y QR de acceso conforme a lo que acuerde el Product Owner.
- Los **18 `test.todo` continúan pendientes**: no cuentan como pruebas implementadas.

Commits registrados: el primer incremento consta en el historial original del repositorio; el avance con código, interfaz y tests quedó guardado en el commit **`49d1959`** de la rama `feature/tp6-inscripciones-tdd`. Un único commit de integración no representa por sí solo todos los pasos internos de TDD.


---

## Ciclos TDD adicionales — 19/10/2026

Esta sección incorpora los ciclos realizados posteriormente a la documentación inicial. Se registran los commits de cada etapa y las ejecuciones observadas. Los resultados antiguos del documento corresponden a momentos anteriores del desarrollo.

### Ciclo 3 — Confirmación de inscripción con resumen y QR

**RED — Commit `d4c5ce3`**

Se agregó `backend/tests/confirmacionCorreo.test.js` para comprobar que una inscripción válida devuelve los datos de confirmación y un identificador QR por participante.

La prueba falló porque `confirmacionCorreo` todavía no estaba presente en el resultado esperado.

**GREEN — Commit `d82bf95`**

Se implementó la generación de la confirmación con el código de inscripción, actividad, fecha, horario, cantidad de participantes y códigos QR individuales.

La nueva prueba pasó junto con las pruebas existentes.

**REFACTOR — Commit `f8e7d9d`**

Se separó la preparación de la confirmación en `backend/src/servicios/confirmacionCorreo.js`, conservando el comportamiento.

Resultado registrado: 50 pruebas aprobadas, 18 `test.todo` y compilación correcta del frontend.

Los códigos son identificadores para generar imágenes QR. Esta etapa no demuestra por sí misma una entrega real de correo electrónico.

### Ciclo 4 — Rechazar correos electrónicos con formato inválido

**RED — Commit `64e9547`**

Se agregó `backend/tests/correoInvalido.test.js`.

La prueba envió el valor `correo-sin-arroba` y esperaba HTTP 400, pero recibió HTTP 201: el sistema registraba la inscripción con ese correo.

**GREEN — Commit `8a858d3`**

Se incorporó la comprobación del formato del correo en el servicio, antes de guardar la inscripción.

Resultado: 60 pruebas aprobadas, 18 `test.todo` y ninguna prueba fallida.

**REFACTOR — Commit `d449989`**

Se extrajo la validación a la función `validarCorreo()`, separándola del procedimiento principal de inscripción.

Resultado: 60 pruebas aprobadas, 18 `test.todo`, compilación correcta y `git diff --check` sin observaciones.

### Ciclo 5 — Exigir un correo electrónico obligatorio

**RED — Commit `1ef0745`**

Se agregó `backend/tests/correoObligatorio.test.js`, con cuatro casos:

- Correo ausente.
- Correo `null`.
- Correo vacío.
- Correo compuesto solamente por espacios.

Las cuatro pruebas fallaron. El correo ausente provocaba un error técnico de SQLite y los otros casos devolvían un mensaje de formato inválido.

Se esperaba HTTP 400 con el mensaje `El correo electronico es obligatorio.` y que no se guardara la inscripción ni se intentara enviar una confirmación.

**GREEN — Commit `1f13159`**

Se agregó la validación de obligatoriedad antes de la comprobación del formato y antes de guardar la inscripción.

Resultado: 64 pruebas aprobadas, 18 `test.todo`, ninguna fallida y compilación correcta.

**REFACTOR — Commit `4d64ae5`**

Se separaron las responsabilidades de validación mediante:

- `correoVacio()`: comprueba si el correo falta o está vacío.
- `formatoCorreoValido()`: verifica su formato.
- `validarCorreo()`: coordina las validaciones y los mensajes de error.

Resultado final comprobado:

```text
Test Suites: 10 passed, 10 total
Tests:       18 todo, 64 passed, 82 total
```

La compilación con `npm.cmd run build` finalizó correctamente. `git diff --check` no informó errores.

### Corrección de seguridad independiente

**Commit `fd6b160`**

Se retiraron las credenciales del archivo público `backend/.env.example`, dejando el modo simulado por defecto.

Esta modificación no constituye una etapa TDD. La contraseña de aplicación anteriormente publicada debe ser revocada por su propietario, porque permanece en el historial de Git.

### Estado de las evidencias

Los ciclos 3, 4 y 5 tienen commits diferenciados para RED, GREEN y REFACTOR.

Las 64 pruebas aprobadas son pruebas automatizadas, no 64 ciclos TDD independientes.

Los 18 `test.todo` no se ejecutan y no deben contabilizarse como pruebas aprobadas. Se revisarán para identificar casos ya cubiertos y faltantes reales.

El envío real mediante Gmail, la validación de acceso por QR y las pruebas específicas de concurrencia requieren verificaciones adicionales antes de afirmar que están completamente comprobados.
