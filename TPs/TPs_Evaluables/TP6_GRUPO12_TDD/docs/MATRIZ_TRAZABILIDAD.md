**Materia:** Ingeniería y Calidad de Software

**Grupo:** 12

**Historia de usuario:** Inscribirme a actividad

**Última actualización:** 19/10/2026

## 1. Objetivo

Relacionar los criterios de aceptación de la historia de usuario con las funcionalidades implementadas, las pruebas automatizadas y las verificaciones pendientes.

Se conservan los identificadores CA-01 a CA-16 utilizados por el equipo.

**Importante:** una prueba que comprueba el rechazo de una inscripción inválida debe finalizar con PASS cuando el sistema la rechaza correctamente.

## 2. Matriz de criterios de aceptación

| Criterio | Comportamiento esperado | Evidencia automatizada | Estado |
| --- | --- | --- | --- |
| CA-01 | Mostrar las cuatro actividades del parque | `base.test.js`: verifica catálogo, nombres y capacidades | Cubierto en API; revisión visual pendiente |
| CA-02 | Consultar fecha, horarios y cupos disponibles | `integracionInscripciones.test.js`: consulta de turnos y cupos desde SQLite | Cubierto en API |
| CA-03 | Permitir turnos de 09:00 a 17:00 | `inscribirmeActividad.test.js`: inscripción válida y rechazo de 18:00 | Parcial; ampliar pruebas de 09:00 y 17:00 |
| CA-04 | Rechazar inscripciones cuando el parque está cerrado | `inscribirmeActividad.test.js`: lunes, Navidad y Año Nuevo | Cubierto |
| CA-05 | Permitir reservas entre 24 horas y 15 minutos antes | `inscribirmeActividad.test.js`: límites exactos y valores fuera del intervalo | Cubierto |
| CA-06 | Inscribir participantes individuales y grupos | `inscribirmeActividad.test.js`: inscripción individual, grupo completo y grupo inválido | Cubierto en servicio |
| CA-07 | Validar DNI y edad; permitir nombre opcional | `inscribirmeActividad.test.js`: DNI inválido, edad inválida y nombre opcional | Cubierto |
| CA-08 | Respetar las edades mínimas por actividad | `inscribirmeActividad.test.js`: límites de Safari, Jardinería, Palestra y Tirolesa | Cubierto |
| CA-09 | Exigir talle solamente cuando corresponde | `inscribirmeActividad.test.js`: talles válidos, inválidos y actividades sin talle | Cubierto |
| CA-10 | Respetar el máximo de participantes por turno | `inscribirmeActividad.test.js`: cupo completo, cantidad excedida y ocupación previa | Cubierto en servicio; concurrencia pendiente de prueba específica |
| CA-11 | Impedir superposiciones horarias por DNI | `inscribirmeActividad.test.js`: superposición y turnos consecutivos | Cubierto en servicio |
| CA-12 | Exigir la aceptación de términos | `inscribirmeActividad.test.js`: rechazo cuando no se aceptan | Cubierto; aprobación de términos particulares pendiente del PO |
| CA-13 | Revalidar cupos al confirmar una inscripción | Servicio de inscripción y transacción `BEGIN IMMEDIATE` en el repositorio SQLite | Implementado; falta prueba automatizada de solicitudes concurrentes |
| CA-14 | Rechazar inscripciones inválidas sin guardarlas | `inscribirmeActividad.test.js`, `integracionInscripciones.test.js`, `correoInvalido.test.js` y `correoObligatorio.test.js` | Cubierto para los errores probados; ampliar escenarios de persistencia |
| CA-15 | Registrar inscripción y generar resumen con QR | `integracionInscripciones.test.js` y `confirmacionCorreo.test.js` | Registro y preparación de QR cubiertos; lectura y validación de QR no implementadas |
| CA-16 | Preparar y enviar confirmación por correo | `envioCorreo.test.js`, `correoSmtp.test.js` y `disenoCorreo.test.js` | Simulación y transporte controlado probados; recepción real en Gmail pendiente |

## 3. Validaciones adicionales del correo

Además de los criterios originales, se incorporaron pruebas para mejorar la consistencia de la inscripción.

### Formato del correo electrónico

**Archivo:** `backend/tests/correoInvalido.test.js`

Se comprobó que el sistema rechaza un correo con formato inválido antes de guardar la inscripción.

Ciclo TDD:

- RED: `64e9547`
- GREEN: `8a858d3`
- REFACTOR: `d449989`

### Correo electrónico obligatorio

**Archivo:** `backend/tests/correoObligatorio.test.js`

Se agregaron cuatro casos:

1. Correo ausente.
2. Correo nulo.
3. Correo vacío.
4. Correo compuesto solamente por espacios.

En todos los casos se espera:

- HTTP 400.
- Mensaje `El correo electronico es obligatorio.`
- Ninguna inscripción guardada.
- Ningún intento de envío de confirmación.

Ciclo TDD:

- RED: `1ef0745`
- GREEN: `1f13159`
- REFACTOR: `4d64ae5`

## 4. Pruebas de integración

El archivo `backend/tests/integracionInscripciones.test.js` comprueba:

- Consulta de turnos disponibles desde SQLite.
- Registro y consulta posterior de una inscripción.
- Actualización de los cupos disponibles.
- Rechazo de una inscripción superpuesta para el mismo DNI.
- Rechazo de participantes que no cumplen la edad mínima, sin guardarlos.
- Detección de un lunes como día de cierre.

Estas pruebas utilizan SQLite en memoria para no alterar los datos de una ejecución normal.

La existencia de pruebas de integración no demuestra automáticamente que todas las operaciones concurrentes sean correctas.

## 5. Pruebas de confirmación y correo

### Confirmación de inscripción

`confirmacionCorreo.test.js` comprueba que se preparan:

- Destinatario.
- Código de inscripción.
- Actividad, fecha y horario.
- Cantidad de participantes.
- Un identificador QR por participante.

### Envío de confirmación

`envioCorreo.test.js` comprueba:

- Invocación del envío después de una inscripción válida.
- Ausencia de envío ante una inscripción inválida.
- Conservación de la reserva si ocurre un error de envío.
- Ausencia de exposición del mensaje interno de error del transporte en la respuesta probada.

### SMTP y diseño

`correoSmtp.test.js` verifica el comportamiento del adaptador mediante un transporte controlado.

`disenoCorreo.test.js` comprueba elementos del asunto, contenido y presentación HTML, incluyendo el tratamiento de caracteres especiales.

**Estas pruebas no confirman una entrega real a Gmail.**

## 6. Resultado actual de las pruebas

Última ejecución registrada: **19/10/2026**.

```text
Test Suites: 10 passed, 10 total
Tests:       18 todo, 64 passed, 82 total
Snapshots:   0 total
```

El comando `npm.cmd run build` también finalizó correctamente.

Interpretación:

- 64 pruebas automatizadas aprobadas.
- 0 pruebas fallidas.
- 18 casos `test.todo` que Jest no ejecuta.
- 10 suites aprobadas.

Las 64 pruebas no equivalen a 64 criterios de aceptación ni a 64 ciclos TDD independientes.

## 7. Evidencia de ciclos TDD

| Ciclo | RED | GREEN | REFACTOR |
| --- | --- | --- | --- |
| Confirmación con resumen y QR | `d4c5ce3` | `d82bf95` | `f8e7d9d` |
| Correo con formato inválido | `64e9547` | `8a858d3` | `d449989` |
| Correo obligatorio | `1ef0745` | `1f13159` | `4d64ae5` |

El ciclo de rechazo por falta de cupos también cuenta con registros RED, GREEN y REFACTOR, aunque no se conservaron tres commits independientes.

Las evidencias y los resultados de cada etapa se describen en `CICLOS_TDD.md`.

## 8. Casos pendientes de revisión

El archivo `backend/tests/inscripciones.pendientes.test.js` conserva 18 `test.todo`.

Varios de esos comportamientos ya aparecen cubiertos por pruebas ejecutables de otros archivos.

Antes de eliminarlos o convertirlos en pruebas, se debe revisar cada caso y comprobar si su alcance está cubierto completamente.

No se consideran 18 funcionalidades faltantes ni 18 pruebas aprobadas.

## 9. Riesgos y verificaciones pendientes

### Concurrencia y transacciones

El repositorio SQLite utiliza una transacción `BEGIN IMMEDIATE` y revalida la ocupación antes de insertar.

Falta ejecutar una prueba específica donde dos solicitudes compiten por el último cupo.

### Datos personales

La ruta `GET /api/inscripciones/:codigo` devuelve datos de la inscripción, incluidos participantes y correo electrónico.

Es necesario revisar su exposición antes de utilizar el sistema en un entorno público.

### Códigos QR

Se generan identificadores vinculados al código de reserva y al número de participante.

La generación visual está implementada, pero todavía no existe una comprobación integral de lectura y validación de acceso al parque.

### Correo real

Existen implementación SMTP y pruebas con transporte controlado.

La recepción efectiva en una cuenta de Gmail sigue sin verificarse.

Las credenciales deben conservarse exclusivamente en `backend/.env`, ignorado por Git.

### Términos particulares

El proyecto distingue condiciones confirmadas de propuestas pendientes de validación del Product Owner.

Se debe conservar esa distinción en la documentación y la presentación al visitante.

### Subtotales y total

La FAQ menciona subtotales y total, pero no establece importes para las actividades de esta historia de usuario.

No se deben reutilizar automáticamente los precios de la historia de compra de entradas ni inventar valores.

## 10. Fuentes del alcance

- Enunciado oficial del TP6, historia de usuario «Inscribirme a actividad».
- FAQ del Product Owner de Eco Harmony Park.
- Documento de términos y condiciones compartido por el Grupo 12.
- Código y pruebas automatizadas del proyecto.

Las verificaciones pendientes representan límites de la evidencia actual y no deben presentarse como funcionalidades completamente comprobadas.


---

## 11. Estado actualizado de la trazabilidad - 19/10/2026

Esta sección registra los resultados más recientes y reemplaza los estados anteriores que mencionan 64 pruebas, 18 test.todo o verificaciones que ya fueron completadas. Los resultados anteriores se conservan como evidencia histórica.

### Resultado automatizado vigente

```text
Test Suites: 12 passed, 12 total
Tests:       71 passed, 71 total
Snapshots:   0 total
```

El frontend compiló correctamente mediante `npm.cmd run build`.

No existen pruebas fallidas ni casos `test.todo` pendientes en Jest.

### Actualización de criterios

| Criterio | Evidencia incorporada | Estado actualizado |
| --- | --- | --- |
| CA-03 | `verificacionesPendientes.test.js` comprueba 09:00 y 17:00 | Cubierto en los límites probados |
| CA-06 | Prueba de grupo inválido sin registros parciales | Cubierto en SQLite para el caso probado |
| CA-10 | `concurrenciaCupos.test.js` comprueba dos solicitudes por el último cupo | Cubierto en una instancia de la aplicación |
| CA-12 | Prueba de persistencia de aceptación de términos | Cubierto en SQLite |
| CA-13 | Verificación de cupos mediante solicitudes concurrentes | Cubierto para el escenario probado |
| CA-14 | Rechazo de correo ausente, vacío o inválido y grupos inválidos | Cubierto para los errores probados |
| CA-15 | Confirmación con QR y verificación de identificadores sin DNI ni correo | Cubierto para generación; lectura no implementada |
| CA-16 | Pruebas de correo simulado y SMTP con transporte controlado | Automatizado; entrega real pendiente |

### Privacidad de la consulta

Se agregó `privacidadInscripciones.test.js`.

La consulta `GET /api/inscripciones/:codigo` devuelve únicamente:

- Código de inscripción.
- Identificador de actividad.
- Fecha.
- Horario.
- Cantidad de participantes.

Los datos personales permanecen almacenados, pero no se incluyen en esa respuesta.

Commits TDD:

- RED: `c2f2437`
- GREEN: `7116142`
- REFACTOR: `eeeeb28`

La consulta por código no implementa autenticación.

### Verificaciones manuales

Se comprobaron desde el navegador los siguientes recorridos:

- **Tirolesa:** inscripción individual, confirmación y QR.
- **Palestra:** inscripción grupal con dos participantes y dos QR diferentes.
- **Palestra:** rechazo desde el formulario de un participante de 11 años.
- **Safari:** inscripción de un participante de 5 años sin talle.
- **Jardinería:** inscripción de un participante de 6 años sin talle.

Las pruebas se realizaron con reloj simulado, base de datos temporal y correo simulado.

Estas verificaciones no demuestran la recepción real de Gmail ni la lectura de códigos QR.

### Mantenimiento y seguridad

Se actualizó Jest a la versión 30.5.2 mediante el commit `0504e71`.

Resultados de auditoría:

- 0 vulnerabilidades reportadas en dependencias de producción.
- 0 alertas altas en la instalación completa.
- 19 alertas moderadas en dependencias de desarrollo.

La contraseña de aplicación de Gmail anteriormente publicada debe ser revocada por su propietario.

### Estado de los antiguos test.todo

Los 18 recordatorios fueron revisados y el archivo `inscripciones.pendientes.test.js` se retiró mediante el commit `517ce96`.

La eliminación no redujo la cantidad de pruebas ejecutables aprobadas.

Las 71 pruebas actuales son verificaciones automatizadas, no 71 ciclos TDD independientes.

## 12. Casos negativos adicionales por criterio

Se incorporaron tres pruebas de backend para ampliar la evidencia de escenarios negativos:

| Criterio | Prueba adicional | Evidencia positiva existente |
| --- | --- | --- |
| CA-01 | `backend/tests/base.test.js`: fallo simulado de consulta a SQLite, HTTP 500 y mensaje general sin exponer detalles internos ni devolver un catálogo | Catálogo con las cuatro actividades y capacidades en el mismo archivo |
| CA-02 | `backend/tests/integracionInscripciones.test.js`: fecha inexistente, HTTP 400, motivo informado y ausencia de turnos | Consulta de turnos disponibles en el mismo archivo |
| CA-15 | `backend/tests/integracionInscripciones.test.js`: rechazo por términos sin aceptar, sin persistencia, código de reserva, confirmación, QR ni intento de envío de correo | Registro en SQLite en integración y resumen con un identificador QR por participante en `confirmacionCorreo.test.js` |

La ausencia de persistencia ante una inscripción inválida se verifica con SQLite en las pruebas de integración. No se incorporan pruebas automatizadas de frontend. El manejo visual de errores del catálogo y la ausencia de una pantalla de confirmación ante un rechazo quedan para verificación manual.

Un escenario negativo aprobado termina en PASS: demuestra que el sistema maneja correctamente un rechazo o error esperado.

`npm.cmd test` ejecuta las pruebas del backend con Jest.

Resultado verificado tras agregar los casos: **74 tests aprobados, 0 fallidos**, en 12 suites de backend. Este resultado reemplaza el total anterior de 71 pruebas.
