# Matriz de trazabilidad — TP6

Actualización CA-16 del 19/10/2026: `envioCorreo.test.js` incorpora `test_inscripción_a_actividad_CorreoConResumenYQR_Pasa` y `test_inscripción_a_actividad_CorreoDeInscripcionInvalida_NoPasa`, más el caso de error de envío sin perder la reserva. `correoSmtp.test.js` cubre aceptación y rechazo por un transporte controlado. Regresión ejecutada: 55 PASS y 18 TODO. La recepción en Gmail sigue pendiente de verificación manual; los estados anteriores de este documento son históricos.

**US:** Como visitante quiero inscribirme a una actividad para reservar mi lugar en la misma.

La tabla conserva los criterios usados en el documento original del grupo. Sus referencias corresponden a los tests visibles en `backend/tests/inscribirmeActividad.test.js` y a las verificaciones registradas. **«Caso inválido» no significa que Jest deba fallar**: un rechazo esperado debe aprobar su test automatizado. Las 18 marcas `test.todo` se mantienen como pendientes y no acreditan cobertura.

| Criterio | Comportamiento | Evidencia/caso válido | Evidencia/caso inválido | Estado y límite |
| --- | --- | --- | --- | --- |
| CA-01 | Catálogo de las cuatro actividades | Catálogo mostrado por frontend y pruebas de infraestructura (`base.test.js`) | Actividad inexistente: `rechaza actividad inexistente` | **Parcial**: confirmar tests específicos para las cuatro opciones |
| CA-02 | Fecha y turno disponibles con cupo | `test_InscribirmeActividad_ActividadConCupo_Pasa` | `test_InscribirmeActividad_ActividadSinCupo_Falla` | **Cubierto en servicio**; disponibilidad en interfaz observada |
| CA-03 | Turnos desde las 09:00 hasta las 17:00 | Inscripción válida a las 10:00 | `rechaza turno de las 18:00` | **Parcial**: ampliar pruebas de límites de horarios 09:00 y 17:00 |
| CA-04 | Días en que el parque está cerrado | Inscripción en sábado | Casos parametrizados `rechaza parque cerrado` (lunes, Navidad, Año Nuevo) | **Cubierto en tests de servicio**; revisar selector visual |
| CA-05 | Anticipación de 24 horas a 15 minutos | `admite reserva con 24 horas exactas` y `15 minutos exactos` | `rechaza reserva fuera de ventana` (24 h + 1 s y 14 min 59 s) | **Cubierto en tests de servicio** |
| CA-06 | Inscripción individual y grupal | Inscripción individual y `admite un grupo que ocupa exactamente los 10 cupos` | `rechaza grupo con participante menor y no guarda nada` | **Cubierto en servicio**, pendiente comprobar atomicidad de persistencia |
| CA-07 | DNI y edad requeridos; nombre opcional | `admite nombre opcional segun la FAQ` | Casos parametrizados `rechaza DNI`, `rechaza edad`; `rechaza DNI repetido` | **Cubierto en tests de servicio** |
| CA-08 | Edades mínimas de cada actividad | `admite edad limite`: Tirolesa 8, Palestra 12, Safari/Jardinería 0 | `rechaza menor`: Tirolesa 7 y Palestra 11 | **Cubierto en tests de servicio** |
| CA-09 | Talle obligatorio cuando corresponde | `admite talla XXL en Tirolesa`; `Safari no requiere talla` | Casos parametrizados `rechaza talla obligatoria` | **Cubierto en tests de servicio** |
| CA-10 | Respetar cupo máximo por turno | `admite un grupo que ocupa exactamente los 10 cupos` | Sin cupo, grupo de 11 y cálculo con nueve ocupados | **Cubierto en servicio**, concurrencia sin comprobar |
| CA-11 | Evitar superposición por DNI | `permite turnos consecutivos para el mismo DNI` | `rechaza superposicion por DNI entre Safari y Tirolesa` | **Cubierto en servicio** para los casos registrados |
| CA-12 | Aceptar términos específicos | La inscripción individual válida usa `aceptaTerminos: true` | `rechaza terminos sin aceptar` | **Cubierto en servicio**; presentación actualizada bajo demanda |
| CA-13 | Revalidar cupos al confirmar | Recuento de ocupación antes de guardar en el servicio | `test_InscribirmeActividad_ActividadSinCupo_Falla` y `cuenta participantes ocupados` | **Parcial**: falta prueba de solicitudes concurrentes y garantía transaccional |
| CA-14 | Rechazar entradas inválidas sin registrar | Helper `verificarRechazo` comprueba que no se agrega inscripción en memoria | Casos de edad, DNI, talla, términos, horario y cantidad incorrectos | **Parcial**: falta acreditar mismo comportamiento con SQLite ante fallos |
| CA-15 | Registro, resumen y QR | Cinco tests en `integracionInscripciones.test.js`; registro y QR observados en interfaz | Sin evidencia compartida de test de lectura/validación del QR | **Parcial**: persistencia y QR visual; lectura/validación no acreditada |
| CA-16 | Confirmación por correo | Vista previa de correo **simulado** observada en frontend | Sin test ni envío real de correo demostrado | **Pendiente**: definir alcance aceptado y completar contenido exigido por PO |

## Resultado global registrado

```text
Test Suites: 4 passed, 4 total
Tests:       18 todo, 49 passed, 67 total
```

Son **49 pruebas automatizadas aprobadas** en total; incluyen pruebas de infraestructura y de integración. No equivalen a 49 pruebas de aceptación distintas ni a 49 ciclos TDD completos.

## Ambigüedades que requieren definición

- El enunciado de inscripción pide correo con detalle y QR. La FAQ también menciona **número de orden, subtotales y total**, pero **no fija un precio para las actividades**. Los valores VIP/común pertenecen a la historia de compra de entradas. No inventar importes ni asumir gratuidad.
- La FAQ no establece inequívocamente que la vista previa o simulación de correo sea suficiente para la entrega. Confirmar con el PO.
- Para los términos y condiciones distinguir reglas confirmadas de propuestas particulares sujetas a validación, conforme al PDF que envió el Grupo 12.
- La persistencia debe verificarse para concurrencia y grupos sin escritura parcial; las pruebas en memoria por sí solas no lo aseguran.

**Fuentes del alcance:** enunciado oficial de TP6 (págs. 11 y 13), FAQ PO TDD EcoHarmony Park y PDF de términos específicos enviado por el Grupo 12.
