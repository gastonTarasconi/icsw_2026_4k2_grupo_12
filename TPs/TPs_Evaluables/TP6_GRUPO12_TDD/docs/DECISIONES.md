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
