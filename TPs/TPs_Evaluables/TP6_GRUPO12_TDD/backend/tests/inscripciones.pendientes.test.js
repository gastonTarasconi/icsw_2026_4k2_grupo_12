
// Elegir un caso, reemplazar test.todo por una prueba real y ejecutar para ver RED.
// Estos pendientes no son pruebas ejecutadas ni evidencia de TDD.
describe('US-01: inscripción a una actividad (pendiente)', () => {
  test.todo('inscribe a una persona en Safari con datos válidos');
  test.todo('admite edad cero en Safari y Jardinería y nombre opcional');
  test.todo('admite 12 años en Palestra y 8 años en Tirolesa');
  test.todo('rechaza edades negativas, ausentes y no numéricas');
  test.todo('exige DNI válido y rechaza pasaporte');
  test.todo('exige una talla válida solamente en Palestra y Tirolesa');
  test.todo('consulta turnos de 09:00 a 17:00 y rechaza 18:00');
  test.todo('rechaza lunes, 1 de enero y 25 de diciembre');
  test.todo('admite exactamente 24 horas y exactamente 15 minutos antes');
  test.todo('rechaza 24 horas y un segundo y 14 minutos y 59 segundos antes');
  test.todo('exige y registra la aceptación de términos');
  test.todo('acepta grupos completos y revierte todo si un integrante falla');
  test.todo('revalida cupos al confirmar y rechaza grupos sin lugar suficiente');
  test.todo('impide superposiciones por DNI y permite turnos consecutivos');
  test.todo('dos solicitudes por el último cupo confirman solamente una');
  test.todo('persiste la inscripción y permite consultar su confirmación');
  test.todo('genera un QR con token opaco sin datos personales');
  test.todo('invoca el correo simulado con el resumen de la inscripción');
});
