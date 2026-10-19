# Decisiones de diseño — TP6 EcoHarmony Park

Historia de usuario asignada al **Grupo 12**: **«Inscribirme a actividad»**. Este documento actualiza las decisiones de la base inicial, sin confundir el alcance de inscripción con la historia «Comprar entradas».

## 1. Evolución del alcance

### Estado inicial (documentado por el equipo)

El repositorio comenzó con el catálogo de actividades, la presentación de términos, una base ejecutable en Express y React y verificaciones de infraestructura. En esa etapa **no existían** inscripción completa, turnos, cupos, participantes, QR ni correo. Ese texto describía la base de partida, no el estado actual del proyecto.

### Estado comprobado después de los avances del 18/10/2026

Se incorporaron servicio de inscripción con reglas de negocio, consulta de turnos y cupos, persistencia de inscripciones en SQLite, formulario web responsive, aceptación de términos por actividad, código de confirmación y representación visual de QR. La pantalla de confirmación incluye una **vista previa de correo simulado**, no un envío acreditado.

La batería registrada llegó a **49 pruebas aprobadas**, **18 `todo`** y **0 fallidas**; el frontend compiló correctamente. La interfaz de Tirolesa se probó manualmente mediante un reloj local de demostración (`RELOJ_PRUEBA`). No inferimos de estos resultados que todas las operaciones concurrentes o el correo real estén resueltos.

## 2. Tecnologías y estructura

- **JavaScript** con **Node.js**, **Express** para la API y **React + Vite** para la interfaz.
- **Jest** para las pruebas automatizadas y **Supertest** para las pruebas de endpoints/integración existentes.
- **SQLite** mediante `node:sqlite`; requiere una versión compatible de Node (el proyecto se ejecutó con Node 24).
- **npm workspaces** para separar `backend` y `frontend` y ejecutar comandos desde la raíz del TP6.
- Librería **`qrcode`** para representar los QR en el frontend.

Mantenemos servicios independientes de Express y repositorios separados del manejo de solicitudes. `crearAplicacion` recibe sus dependencias, lo que permite trabajar con conexiones en memoria para los tests. No incorporamos autenticación real ni pagos: no forman parte de esta historia.

## 3. Datos, pruebas y persistencia

La primera implementación de inscripción utilizó un repositorio **en memoria** para mantener las pruebas aisladas de la base local. Posteriormente se incorporaron estructura y repositorio de inscripciones en SQLite, y rutas de API. Se sumaron cinco tests en `backend/tests/integracionInscripciones.test.js`.

El servicio valida las reglas con el reloj inyectable `obtenerAhora`, de modo que los tests sean repetibles. En la demostración local se usó `RELOJ_PRUEBA` para habilitar temporalmente turnos sin alterar el reloj de Windows. **No debe quedar habilitado en una ejecución normal o de entrega sin indicarlo claramente.**

Se comprueban en los tests de servicio: cupos según cantidad de participantes, edades, DNI, tallas cuando corresponde, aceptación de términos, horarios de 09:00 a 17:00, días cerrados, anticipación de 24 horas a 15 minutos, superposiciones por DNI y grupos inválidos. Las fechas de los turnos se interpretan en horario argentino mediante un desplazamiento `-03:00` para los ejemplos ensayados.

**Limitación:** las pruebas de servicio sobre repositorio en memoria no acreditan por sí solas atomicidad bajo concurrencia. Se debe revisar la transacción de inscripción y cubrir intentos simultáneos por el último cupo, además de confirmar ausencia de registros parciales tras un error.

## 4. Interfaz, términos y códigos QR

Se respetó el catálogo **Safari, Palestra, Tirolesa y Jardinería**, las capacidades, los talles requeridos y las edades mínimas definidas en la FAQ. El diseño utiliza el logo y la paleta institucional del proyecto. Los términos específicos pueden leerse en una ventana, sin ocupar permanentemente el espacio del formulario, y deben aceptarse antes de confirmar.

La pantalla de resultado muestra identificador de inscripción y un QR por participante. El contenido presentado al usuario está previsto para identificar reserva y participante **sin incluir datos personales directamente en el QR**. Falta verificar la solución de lectura/validación de esos QR para un ingreso real; no se presenta como terminada.

El PDF de términos remitido al Product Owner se toma como base de las reglas específicas. Debe diferenciarse entre **reglas confirmadas** y **pautas particulares propuestas para validación**, tal como está expresado en ese documento.

## 5. Confirmación por correo y montos

El enunciado de «Inscribirme a actividad» pide enviar un correo con la inscripción y un código QR. La FAQ menciona número de orden, visitantes, subtotales y total, y también solicita un resumen con los QR. **Por ahora solo hay una vista previa de correo simulado**; no se demostró envío efectivo a una cuenta de correo.

Los precios publicados por el PO para entradas VIP y comunes corresponden a la otra historia («Comprar entradas»). Los documentos de esta US **no fijan precios de las actividades ni afirman que sean gratuitas**. Por lo tanto, no cargamos importes inventados ni aplicamos descuentos de entradas. **Pendiente consultar al PO** cómo deben representarse los subtotales y el total del correo de inscripción, y qué modalidad de simulación de correo acepta para TP6.

## 6. Calidad, evidencia y estado de entrega

- Resultado registrado: **49 PASS, 18 TODO, 0 FAIL**; build de Vite correcto.
- El ciclo de cupos tiene salidas documentadas para **RED, GREEN y REFACTOR** en `CICLOS_TDD.md`. No se afirma que cada prueba aprobada constituya un ciclo independiente evidenciado.
- `MATRIZ_TRAZABILIDAD.md` relaciona criterios con pruebas y señala cobertura parcial o pendiente.
- La documentación exigida por TP6 incluye decisiones de diseño. No basta con el número de pruebas: hace falta revisar la funcionalidad completa, coherencia con la FAQ y evidencias de los ciclos.
- `npm ci` informó **33 vulnerabilidades (5 moderadas, 28 altas)** en el entorno utilizado. Queda pendiente ejecutar y evaluar `npm audit`, sin aplicar `npm audit fix --force` indiscriminadamente.

## 7. Control de versiones y pendientes

El avance está registrado en el commit **`49d1959`**, dentro de la rama **`feature/tp6-inscripciones-tdd`**, publicada en el repositorio compartido del grupo. **`main` no fue modificada** por este avance. La integración debe realizarse después de revisión del equipo mediante Pull Request.

Pendientes prioritarios: confirmar requisitos del correo/importe con el PO; cerrar o justificar `test.todo`; revisar concurrencia y transacciones; ejecutar pruebas manuales de las cuatro actividades y en pantalla móvil; revisar dependencias; completar la documentación y adjuntar evidencias reales.

No se implementan en esta historia compra de entradas, Mercado Pago ni panel de administración.


---

## 8. Actualización de decisiones — 19/10/2026

Esta sección complementa las decisiones anteriores. Los resultados de 49 pruebas aprobadas mencionados en el documento corresponden al estado del 18/10/2026, no al estado actual.

### 8.1. Validación del correo electrónico

Se decidió que el correo electrónico sea obligatorio y tenga un formato válido antes de registrar una inscripción.

La validación se realiza en el servicio de inscripciones, independientemente de las comprobaciones del frontend o de las restricciones de SQLite.

Para facilitar el mantenimiento, se separaron tres funciones:

- `correoVacio()`: detecta valores ausentes, nulos o vacíos.
- `formatoCorreoValido()`: comprueba el formato del correo.
- `validarCorreo()`: aplica las validaciones y genera los mensajes de error.

La aplicación responde con HTTP 400 cuando el correo es inválido. No se guarda la inscripción ni se envía una confirmación en los casos probados.

Esta decisión se desarrolló mediante dos ciclos TDD:

**Formato inválido**

- RED: `64e9547`.
- GREEN: `8a858d3`.
- REFACTOR: `d449989`.

**Correo obligatorio**

- RED: `1ef0745`.
- GREEN: `1f13159`.
- REFACTOR: `4d64ae5`.

### 8.2. Confirmación y envío de correo

Se incorporó un servicio para preparar la confirmación de inscripción con los datos de la actividad, fecha, horario, participantes y códigos QR.

Se mantienen dos modalidades:

- **Simulado:** no envía mensajes reales. Permite generar y consultar una confirmación durante la ejecución.
- **SMTP:** permite intentar el envío mediante Gmail, utilizando Nodemailer y credenciales configuradas localmente.

El envío SMTP incluye un archivo PNG con el código QR de cada participante.

Si el transporte de correo falla, la inscripción ya registrada se conserva. El sistema informa el estado del envío de manera independiente.

El resultado de las pruebas automatizadas no demuestra que el correo haya sido recibido en una cuenta real. Esa verificación continúa pendiente.

### 8.3. Configuración y seguridad

Se decidió conservar las credenciales privadas únicamente en `backend/.env`, excluido del seguimiento habitual de Git.

El archivo `backend/.env.example` debe contener variables de ejemplo sin usuarios ni contraseñas reales. El modo predeterminado es `simulado`.

Esta corrección se registró en el commit `fd6b160`.

La contraseña de aplicación publicada anteriormente debe ser revocada por el propietario de la cuenta, porque quitarla del archivo no elimina su presencia en el historial del repositorio.

### 8.4. Persistencia y concurrencia

Se mantiene SQLite para guardar inscripciones y evitar introducir una infraestructura de base de datos externa.

El repositorio utiliza `BEGIN IMMEDIATE` y revalida los cupos dentro de la transacción antes de confirmar una reserva.

Se considera una protección implementada, pero todavía debe comprobarse mediante pruebas específicas de solicitudes concurrentes contra SQLite.

No se considera demostrado un comportamiento que no haya sido probado.

### 8.5. Información personal

La inscripción necesita datos de los participantes y un correo electrónico de contacto.

La ruta de consulta por código devuelve actualmente datos de la inscripción, entre ellos DNI y correo.

Se decidió revisar la información expuesta por esta ruta antes de considerar que el sistema está preparado para un uso público.

No se afirma que exista autenticación o un sistema de permisos de acceso, porque no se implementaron como parte de esta historia.

### 8.6. Alcance de los códigos QR

Se mantiene la decisión de generar un identificador por participante, sin incorporar directamente el DNI o el correo en el contenido del QR.

La interfaz representa visualmente estos identificadores.

La lectura y validación de los QR en el ingreso al parque no se consideran implementadas. Su necesidad debe verificarse contra el alcance solicitado.

### 8.7. Pruebas y evidencia TDD

El último resultado automatizado registrado el 19/10/2026 es:

- 10 suites aprobadas.
- 64 pruebas aprobadas.
- 0 pruebas fallidas.
- 18 casos `test.todo` sin ejecutar.
- Compilación de frontend exitosa.

Se mantienen los ciclos RED, GREEN y REFACTOR documentados en `CICLOS_TDD.md`, con los commits correspondientes.

Las pruebas aprobadas no equivalen a ciclos TDD independientes.

Los 18 `test.todo` se revisarán individualmente para identificar comportamientos ya cubiertos y verificaciones realmente faltantes.

### 8.8. Decisiones de alcance que se mantienen

Se conserva lo establecido anteriormente:

- No implementar la compra de entradas ni pagos.
- No inventar precios de actividades ni asumir que son gratuitas.
- Consultar al Product Owner la interpretación de subtotales y total.
- Respetar edades, cupos, talles y horarios definidos en la FAQ.
- Mantener diferenciadas las condiciones confirmadas y las propuestas pendientes de aprobación.
- Conservar las pruebas automatizadas y la evidencia de TDD.
- Coordinar con el grupo la integración de la rama a `main`.

## 9. Estado de revisión pendiente

Antes de finalizar el trabajo se deberá verificar:

1. Cobertura real de los 18 `test.todo`.
2. Concurrencia y consistencia de los cupos en SQLite.
3. Exposición de datos personales.
4. Funcionamiento manual de las cuatro actividades.
5. Presentación y comportamiento de los códigos QR.
6. Recepción real del correo, si corresponde al alcance exigido.
7. Correspondencia de la aplicación con la consigna y la FAQ.
8. Dependencias y avisos de seguridad.

Estos puntos se mantienen explícitamente pendientes hasta contar con evidencia de su verificación.


---

## Actualizacion de decisiones - 19/10/2026

Esta seccion registra las decisiones y limitaciones vigentes al finalizar las verificaciones del TP6. Las entradas anteriores se conservan como historial del desarrollo.

### 1. Privacidad de la consulta de inscripciones

**Decision:** limitar la respuesta de `GET /api/inscripciones/:codigo` a los datos necesarios para identificar la reserva.

La respuesta incluye codigo, actividad, fecha, horario y cantidad de participantes. No devuelve DNI, correo ni datos personales de los participantes.

**Justificacion:** reducir la exposicion innecesaria de informacion personal.

**Evidencia TDD:**

- RED: `c2f2437`.
- GREEN: `7116142`.
- REFACTOR: `eeeeb28`.

**Limitacion:** la consulta por codigo todavia no requiere autenticacion. Esta mejora no reemplaza un sistema de control de acceso.

### 2. Manejo de cupos y concurrencia

**Decision:** mantener la validacion de cupos dentro de una transaccion SQLite y rechazar inscripciones que superen la disponibilidad.

**Evidencia:** `concurrenciaCupos.test.js` comprueba dos solicitudes simultaneas por el ultimo cupo de Tirolesa.

**Alcance comprobado:** una instancia de la aplicacion con la base de datos utilizada en las pruebas. No se realizaron pruebas distribuidas ni de carga masiva.

### 3. Confirmaciones y codigos QR

**Decision:** generar un codigo QR individual por participante y mostrar la confirmacion de la inscripcion.

Los identificadores utilizados en el QR no incorporan DNI ni correo electronico.

**Limitacion:** la generacion del QR esta probada, pero no se implemento ni verifico un sistema de lectura y control de ingreso.

### 4. Envio de correos electronicos

**Decision:** conservar un modo simulado para las verificaciones y permitir la configuracion de SMTP sin incluir credenciales reales en archivos de ejemplo.

Las pruebas automatizadas comprueban la logica de correo mediante transportes controlados. Las pruebas manuales se realizaron en modo simulado.

**Limitacion:** no se verifico la recepcion de mensajes reales en Gmail.

**Accion de seguridad pendiente:** el propietario de la cuenta debe revocar la contrasena de aplicacion que fue publicada anteriormente en el historial de Git.

### 5. Actualizacion de dependencias

**Decision:** actualizar Jest a la version 30.5.2 y conservarla despues de verificar su compatibilidad.

**Evidencia:** commit `0504e71`.

Se comprobaron:

- 71 pruebas aprobadas.
- 12 suites aprobadas.
- 0 pruebas fallidas.
- 0 casos `test.todo`.
- Compilacion del frontend exitosa.

La auditoria de npm reporto:

- 0 vulnerabilidades en dependencias de produccion.
- 0 vulnerabilidades altas en la auditoria completa.
- 19 alertas moderadas asociadas a dependencias de desarrollo.

**Decision:** no ejecutar `npm audit fix --force`, porque la correccion propuesta por npm implica un cambio incompatible de version de Jest.

Las alertas moderadas quedan documentadas para seguimiento.

### 6. Alcance de las verificaciones finales

Se comprobaron manualmente las cuatro actividades del sistema:

- Tirolesa.
- Palestra.
- Safari.
- Jardineria.

Ademas, se verificaron inscripciones grupales, codigos QR diferentes y restricciones de edad y talle segun los escenarios seleccionados.

Estas pruebas utilizaron reloj simulado, base de datos temporal y correo simulado.

**Decision:** conservar estas verificaciones como evidencia manual complementaria a las pruebas automatizadas, sin considerarlas nuevos ciclos TDD.

### 7. Integracion con el repositorio grupal

**Decision:** mantener los cambios del TP6 en la rama `feature/tp6-inscripciones-tdd` hasta que el equipo revise su integracion.

No se modificara directamente `main` durante este cierre.

La fusion de la rama se coordinara con el grupo.