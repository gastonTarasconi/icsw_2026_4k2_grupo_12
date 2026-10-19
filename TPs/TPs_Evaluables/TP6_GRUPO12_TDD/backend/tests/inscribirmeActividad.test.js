
const actividadesPrecargadas = require('../src/database/actividades.json');
const { crearServicioInscripciones } = require('../src/servicios/inscripciones');

/*
 * US-01: Inscribirme a actividad.
 * Pruebas unitarias con repositorio en memoria.
 * No modifican la base SQLite real.
 */

describe('Inscribirme a actividad', () => {
  const SABADO = '2026-10-24';

  let repositorio;
  let datosInscripcion;
  let ahora;

  const persona = (dni = '40123456', edad = 25, talla = 'M') => ({
    nombre: 'Ana Pérez',
    dni,
    edad,
    talla
  });

  beforeEach(() => {
    const actividades = structuredClone(actividadesPrecargadas);

    const fechas = [
      SABADO,
      '2026-10-25',
      '2026-10-26',
      '2026-12-25',
      '2027-01-01'
    ];

    const horarios = [
      '09:00',
      '10:00',
      '11:00',
      '17:00',
      '18:00'
    ];

    const turnos = actividades.flatMap(actividad =>
      fechas.flatMap(fecha =>
        horarios.map(horario => ({
          id: `${actividad.id}-${fecha}-${horario}`,
          actividadId: actividad.id,
          fecha,
          horario,
          capacidad: actividad.capacidad
        }))
      )
    );

    const inscripciones = [];

    repositorio = {
      buscarActividad: jest.fn(id =>
        actividades.find(actividad => actividad.id === id)
      ),

      buscarTurno: jest.fn((actividadId, fecha, horario) =>
        turnos.find(turno =>
          turno.actividadId === actividadId &&
          turno.fecha === fecha &&
          turno.horario === horario
        )
      ),

      guardarInscripcion: jest.fn(inscripcion => {
        inscripciones.push(structuredClone(inscripcion));
      }),

      listarInscripciones: jest.fn(() =>
        structuredClone(inscripciones)
      )
    };

    ahora = '2026-10-24T09:00:00-03:00';

    datosInscripcion = {
      actividadId: 'tirolesa',
      fecha: SABADO,
      horario: '10:00',
      cantidadPersonas: 1,
      participantes: [persona()],
      aceptaTerminos: true,
      email: 'ana@example.com'
    };
  });

  const servicio = () => crearServicioInscripciones({
    repositorio,
    obtenerAhora: () => new Date(ahora)
  });

  const guardarAnterior = (
    actividadId,
    horario,
    participantes,
    fecha = SABADO
  ) =>
    repositorio.guardarInscripcion({
      codigo: `ANT-${repositorio.listarInscripciones().length + 1}`,
      actividadId,
      fecha,
      horario,
      cantidadPersonas: participantes.length,
      participantes,
      aceptaTerminos: true
    });

  const verificarRechazo = async mensaje => {
    const cantidadAnterior =
      repositorio.listarInscripciones().length;

    await expect(
      servicio().inscribir(datosInscripcion)
    ).rejects.toThrow(mensaje);

    expect(
      repositorio.listarInscripciones()
    ).toHaveLength(cantidadAnterior);
  };

  // 1. INSCRIPCION CON CUPOS

  test('test_InscribirmeActividad_ActividadConCupo_Pasa', async () => {
    const resultado = await servicio().inscribir(datosInscripcion);

    expect(resultado.codigo).toEqual(expect.any(String));
    expect(resultado.codigo.length).toBeGreaterThan(0);
    expect(resultado.actividad.nombre).toBe('Tirolesa');

    expect(repositorio.listarInscripciones()).toHaveLength(1);

    expect(repositorio.listarInscripciones()[0]).toEqual(
      expect.objectContaining({
        codigo: resultado.codigo,
        actividadId: 'tirolesa',
        fecha: SABADO,
        horario: '10:00',
        participantes: datosInscripcion.participantes
      })
    );
  });

  // 2. INSCRIPCION SIN CUPOS

  test('test_InscribirmeActividad_ActividadSinCupo_Falla', async () => {
    for (let i = 0; i < 10; i++) {
      guardarAnterior(
        'tirolesa',
        '10:00',
        [persona(String(10000000 + i))]
      );
    }

    await verificarRechazo(/cupo/i);
  });

  // 3. EDADES MINIMAS PERMITIDAS

  test.each([
    ['Tirolesa con 8 años', 'tirolesa', 8],
    ['Palestra con 12 años', 'palestra', 12],
    ['Safari con 0 años', 'safari', 0],
    ['Jardineria con 0 años', 'jardineria', 0]
  ])('admite edad limite: %s', async (_caso, actividadId, edad) => {
    datosInscripcion.actividadId = actividadId;
    datosInscripcion.participantes[0].edad = edad;

    await expect(
      servicio().inscribir(datosInscripcion)
    ).resolves.toHaveProperty('codigo');

    expect(repositorio.listarInscripciones()).toHaveLength(1);
  });

  // 4. EDADES MENORES A LAS PERMITIDAS

  test.each([
    ['Tirolesa con 7 años', 'tirolesa', 7],
    ['Palestra con 11 años', 'palestra', 11]
  ])('rechaza menor: %s', async (_caso, actividadId, edad) => {
    datosInscripcion.actividadId = actividadId;
    datosInscripcion.participantes[0].edad = edad;

    await verificarRechazo(/edad/i);
  });

  // 5. EDADES INVALIDAS

  test.each([
    ['negativa', -1],
    ['ausente', undefined],
    ['texto', 'ocho'],
    ['nula', null]
  ])('rechaza edad %s', async (_caso, edad) => {
    datosInscripcion.participantes[0].edad = edad;

    await verificarRechazo(/edad/i);
  });

  // 6. DNI INVALIDO

  test.each([
    ['alfanumerico', 'PAS123'],
    ['vacio', ''],
    ['ausente', undefined]
  ])('rechaza DNI %s', async (_caso, dni) => {
    datosInscripcion.participantes[0].dni = dni;

    await verificarRechazo(/DNI/i);
  });

  // 7. NOMBRE OPCIONAL

  test('admite nombre opcional segun la FAQ', async () => {
    delete datosInscripcion.participantes[0].nombre;

    await expect(
      servicio().inscribir(datosInscripcion)
    ).resolves.toHaveProperty('codigo');
  });

  // 8. TALLES OBLIGATORIOS

  test.each([
    ['Tirolesa sin talla', 'tirolesa', undefined],
    ['Palestra sin talla', 'palestra', undefined],
    ['Tirolesa con talla invalida', 'tirolesa', 'XXXL']
  ])('rechaza talla obligatoria: %s', async (
    _caso,
    actividadId,
    talla
  ) => {
    datosInscripcion.actividadId = actividadId;
    datosInscripcion.participantes[0].talla = talla;

    await verificarRechazo(/talla/i);
  });

  // 9. TALLE VALIDO

  test('admite talla XXL en Tirolesa', async () => {
    datosInscripcion.participantes[0].talla = 'XXL';

    await expect(
      servicio().inscribir(datosInscripcion)
    ).resolves.toHaveProperty('codigo');
  });

  // 10. ACTIVIDAD SIN TALLE

  test('Safari no requiere talla', async () => {
    datosInscripcion.actividadId = 'safari';
    delete datosInscripcion.participantes[0].talla;

    await expect(
      servicio().inscribir(datosInscripcion)
    ).resolves.toHaveProperty('codigo');
  });

  // 11. TERMINOS Y CONDICIONES

  test('rechaza terminos sin aceptar', async () => {
    datosInscripcion.aceptaTerminos = false;

    await verificarRechazo(/terminos/i);
  });

  // 12. HORARIO INVALIDO

  test('rechaza turno de las 18:00', async () => {
    datosInscripcion.horario = '18:00';
    ahora = '2026-10-24T17:00:00-03:00';

    await verificarRechazo(/horario/i);
  });

  // 13. PARQUE CERRADO

  test.each([
    ['lunes', '2026-10-26', '2026-10-26T09:00:00-03:00'],
    ['Navidad', '2026-12-25', '2026-12-25T09:00:00-03:00'],
    ['Año Nuevo', '2027-01-01', '2027-01-01T09:00:00-03:00']
  ])('rechaza parque cerrado: %s', async (
    _caso,
    fecha,
    reloj
  ) => {
    datosInscripcion.fecha = fecha;
    ahora = reloj;

    await verificarRechazo(/cerrado/i);
  });

  // 14. ANTICIPACION PERMITIDA

  test.each([
    ['24 horas exactas', '2026-10-23T10:00:00-03:00'],
    ['15 minutos exactos', '2026-10-24T09:45:00-03:00']
  ])('admite reserva con %s de anticipacion', async (
    _caso,
    reloj
  ) => {
    ahora = reloj;

    await expect(
      servicio().inscribir(datosInscripcion)
    ).resolves.toHaveProperty('codigo');
  });

  // 15. ANTICIPACION FUERA DEL LIMITE

  test.each([
    ['24 horas y un segundo', '2026-10-23T09:59:59-03:00'],
    ['14 minutos y 59 segundos', '2026-10-24T09:45:01-03:00']
  ])('rechaza reserva fuera de ventana: %s', async (
    _caso,
    reloj
  ) => {
    ahora = reloj;

    await verificarRechazo(/anticipacion/i);
  });

  // 16. SUPERPOSICION DE HORARIOS

  test('rechaza superposicion por DNI entre Safari y Tirolesa', async () => {
    guardarAnterior('safari', '10:00', [persona()]);

    await verificarRechazo(/superposicion/i);
  });

  // 17. TURNOS CONSECUTIVOS

  test('permite turnos consecutivos para el mismo DNI', async () => {
    guardarAnterior('safari', '09:00', [persona()]);

    await expect(
      servicio().inscribir(datosInscripcion)
    ).resolves.toHaveProperty('codigo');

    expect(repositorio.listarInscripciones()).toHaveLength(2);
  });

  // 18. GRUPO CON PARTICIPANTE INVALIDO

  test('rechaza grupo con participante menor y no guarda nada', async () => {
    datosInscripcion.cantidadPersonas = 2;
    datosInscripcion.participantes = [
      persona(),
      persona('40222222', 7)
    ];

    await verificarRechazo(/edad/i);
  });

  // 19. CANTIDAD INCORRECTA

  test('rechaza cantidad distinta del numero de participantes', async () => {
    datosInscripcion.cantidadPersonas = 2;

    await verificarRechazo(/cantidad/i);
  });

  // 20. LISTA VACIA

  test('rechaza lista vacia de participantes', async () => {
    datosInscripcion.cantidadPersonas = 0;
    datosInscripcion.participantes = [];

    await verificarRechazo(/cantidad/i);
  });

  // 21. CUPO EXACTO

  test('admite un grupo que ocupa exactamente los 10 cupos', async () => {
    datosInscripcion.cantidadPersonas = 10;

    datosInscripcion.participantes = Array.from(
      { length: 10 },
      (_, i) => persona(String(20000000 + i))
    );

    await expect(
      servicio().inscribir(datosInscripcion)
    ).resolves.toHaveProperty('codigo');

    expect(repositorio.listarInscripciones()).toHaveLength(1);
  });

  // 22. GRUPO QUE SUPERA LA CAPACIDAD

  test('rechaza grupo que supera la capacidad de Tirolesa', async () => {
    datosInscripcion.cantidadPersonas = 11;

    datosInscripcion.participantes = Array.from(
      { length: 11 },
      (_, i) => persona(String(20000000 + i))
    );

    await verificarRechazo(/cupo/i);
  });

  // 23. CUPOS OCUPADOS POR UN GRUPO

  test('cuenta participantes ocupados, no solo inscripciones', async () => {
    guardarAnterior(
      'tirolesa',
      '10:00',
      Array.from(
        { length: 9 },
        (_, i) => persona(String(30000000 + i))
      )
    );

    datosInscripcion.cantidadPersonas = 2;
    datosInscripcion.participantes = [
      persona(),
      persona('40888888')
    ];

    await verificarRechazo(/cupo/i);
  });

  // 24. ACTIVIDAD INEXISTENTE

  test('rechaza actividad inexistente', async () => {
    datosInscripcion.actividadId = 'inventada';

    await verificarRechazo(/actividad/i);
  });

  // 25. DNI DUPLICADO

  test('rechaza DNI repetido dentro de una misma inscripcion', async () => {
    datosInscripcion.cantidadPersonas = 2;
    datosInscripcion.participantes = [
      persona(),
      persona()
    ];

    await verificarRechazo(/DNI/i);
  });
});
