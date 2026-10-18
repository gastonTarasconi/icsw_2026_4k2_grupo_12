const actividadesPrecargadas = require('../src/database/actividades.json');

/*
 * User Story: Inscribirme a actividad
 * COMO visitante QUIERO inscribirme a una actividad PARA reservar mi lugar en la misma.
 *
 * Precondiciones generales (se preparan antes de cada test):
 *   - Hay actividades y un turno precargados.
 *   - No hay inscripciones previas; los cupos del turno están libres.
 *   - Se usa un repositorio en memoria, sin modificar la base SQLite del sistema.
 *   - El reloj está fijo para que el resultado no dependa de la hora de la computadora.
 */
describe('Inscribirme a actividad', () => {
  const SABADO = '2026-10-24';
  let repositorio;
  let obtenerAhora;
  let datosInscripcion;

  beforeEach(() => {
    const actividades = structuredClone(actividadesPrecargadas);
    const turnos = [{
      id: 'tirolesa-sabado-10',
      actividadId: 'tirolesa',
      fecha: SABADO,
      horario: '10:00',
      inicio: '2026-10-24T10:00:00-03:00',
      fin: '2026-10-24T11:00:00-03:00',
      capacidad: 10
    }];
    const inscripciones = [];

    repositorio = {
      buscarActividad: jest.fn(id => actividades.find(actividad => actividad.id === id)),
      buscarTurno: jest.fn((actividadId, fecha, horario) => turnos.find(turno =>
        turno.actividadId === actividadId && turno.fecha === fecha && turno.horario === horario)),
      guardarInscripcion: jest.fn(inscripcion => {
        inscripciones.push(structuredClone(inscripcion));
      }),
      listarInscripciones: () => structuredClone(inscripciones)
    };

    obtenerAhora = () => new Date('2026-10-24T09:00:00-03:00');
    datosInscripcion = {
      actividadId: 'tirolesa',
      fecha: SABADO,
      horario: '10:00',
      cantidadPersonas: 1,
      participantes: [{ nombre: 'Ana Pérez', dni: '40123456', edad: 25, talla: 'M' }],
      aceptaTerminos: true,
      email: 'ana@example.com'
    };
  });

  test('test_InscribirmeActividad_ActividadConCupo_Pasa', async () => {
    // Precondición: la Tirolesa del sábado a las 10:00 tiene sus 10 lugares libres.
    // Primer ciclo TDD: el servicio mínimo permite pasar este caso a Green.
    const { crearServicioInscripciones } = require('../src/servicios/inscripciones');
    const servicio = crearServicioInscripciones({ repositorio, obtenerAhora });

    // Pasos: inscribir una persona con datos válidos y términos aceptados.
    const resultado = await servicio.inscribir(datosInscripcion);

    // Resultado esperado: se devuelve una confirmación y la inscripción queda guardada.
    expect(resultado.codigo).toEqual(expect.any(String));
    expect(resultado.codigo.length).toBeGreaterThan(0);
    expect(resultado.actividad.nombre).toBe('Tirolesa');
    expect(repositorio.listarInscripciones()).toHaveLength(1);
    expect(repositorio.listarInscripciones()[0]).toEqual(expect.objectContaining({
      codigo: resultado.codigo,
      actividadId: 'tirolesa',
      fecha: SABADO,
      horario: '10:00',
      participantes: datosInscripcion.participantes
    }));
  });
});

