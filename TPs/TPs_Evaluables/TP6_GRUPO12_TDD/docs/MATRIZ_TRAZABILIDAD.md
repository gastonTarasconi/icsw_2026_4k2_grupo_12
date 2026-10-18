# Matriz de trazabilidad

Historia: InscribirmeActividad. Los casos positivos y negativos de esta tabla son el mínimo de cobertura; agregaremos variantes y límites durante el desarrollo.

| Criterio | Comportamiento | Test Pasa | Test NoPasa | Estado |
| --- | --- | --- | --- | --- |
| CA-01 | Consultar las cuatro actividades | Pendiente | Pendiente | Pendiente |
| CA-02 | Seleccionar fecha y turno con cupos | Pendiente | Pendiente | Pendiente |
| CA-03 | Turnos de 09:00 a 17:00 | Pendiente | Pendiente | Pendiente |
| CA-04 | Días de cierre | Pendiente | Pendiente | Pendiente |
| CA-05 | Ventana de inscripción | Pendiente | Pendiente | Pendiente |
| CA-06 | Inscripción individual y grupal | `test_InscribirmeActividad_ActividadConCupo_Pasa` | Pendiente | Green del caso individual; faltan caso negativo y grupal |
| CA-07 | DNI y edad obligatorios; nombre opcional | Pendiente | Pendiente | Pendiente |
| CA-08 | Edades mínimas por actividad | Pendiente | Pendiente | Pendiente |
| CA-09 | Talla válida cuando corresponde | Pendiente | Pendiente | Pendiente |
| CA-10 | Capacidad máxima por turno | Pendiente | Pendiente | Pendiente |
| CA-11 | Evitar superposición por persona | Pendiente | Pendiente | Pendiente |
| CA-12 | Aceptación de términos | Pendiente | Pendiente | Pendiente |
| CA-13 | Revalidar disponibilidad al confirmar | Pendiente | Pendiente | Pendiente |
| CA-14 | Informar errores sin guardar inscripciones inválidas | Pendiente | Pendiente | Pendiente |
| CA-15 | Registro, resumen y QR | Pendiente | Pendiente | Pendiente |
| CA-16 | Correo de confirmación | Pendiente | Pendiente | Pendiente |

El test del primer ciclo verifica el registro individual en memoria y su código de confirmación. No completa CA-15: faltan persistencia SQLite, resumen y QR. Las pruebas de infraestructura y los `test.todo` no cuentan como los casos de aceptación requeridos. El primer caso individual pasó a Green; ningún criterio se considera completado con este único caso.

