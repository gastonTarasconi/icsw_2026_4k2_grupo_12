
const request = require('supertest');
const { abrirBaseDeDatos } = require('../src/database/conexion');
const { inicializarBaseDeDatos } = require('../src/database/inicializar');
const { crearAplicacion } = require('../src/app');

describe('Verificaciones adicionales de inscripciones', () => {
  let db;
  let app;
  let ahora;

  const participante = (dni = '40123456', edad = 25) => ({
    nombre: 'Ana',
    dni,
    edad,
    talla: 'M'
  });

  const datos = () => ({
    actividadId: 'tirolesa',
    fecha: '2026-10-24',
    horario: '10:00',
    cantidadPersonas: 1,
    participantes: [participante()],
    aceptaTerminos: true,
    email: 'ana@example.com'
  });

  beforeEach(() => {
    db = abrirBaseDeDatos(':memory:');
    inicializarBaseDeDatos(db);

    ahora = '2026-10-24T09:00:00-03:00';

    app = crearAplicacion({
      baseDeDatos: db,
      obtenerAhora: () => new Date(ahora),
      enviarCorreo: async () => ({ estado: 'simulado' })
    });
  });

  afterEach(() => {
    db.close();
  });

  test.each([
    ['09:00', '2026-10-24T08:00:00-03:00'],
    ['17:00', '2026-10-24T16:00:00-03:00']
  ])('acepta el horario limite %s', async (horario, reloj) => {
    ahora = reloj;

    const inscripcion = datos();
    inscripcion.horario = horario;

    const respuesta = await request(app)
      .post('/api/inscripciones')
      .send(inscripcion);

    expect(respuesta.status).toBe(201);
    expect(respuesta.body.horario).toBe(horario);
  });

  test('guarda la aceptacion de terminos en SQLite', async () => {
    await request(app)
      .post('/api/inscripciones')
      .send(datos())
      .expect(201);

    const fila = db.prepare(
      'SELECT acepta_terminos FROM inscripciones'
    ).get();

    expect(fila.acepta_terminos).toBe(1);
  });

  test('un grupo invalido no guarda participantes parcialmente', async () => {
    const inscripcion = datos();

    inscripcion.cantidadPersonas = 2;
    inscripcion.participantes = [
      participante('40123456', 25),
      participante('40222222', 7)
    ];

    await request(app)
      .post('/api/inscripciones')
      .send(inscripcion)
      .expect(400);

    const fila = db.prepare(
      'SELECT COUNT(*) AS total FROM inscripciones'
    ).get();

    expect(fila.total).toBe(0);
  });

  test('los identificadores QR no contienen DNI ni correo', async () => {
    const inscripcion = datos();

    inscripcion.cantidadPersonas = 2;
    inscripcion.participantes = [
      participante('40123456'),
      participante('40222222')
    ];

    const respuesta = await request(app)
      .post('/api/inscripciones')
      .send(inscripcion)
      .expect(201);

    const codigos = respuesta.body.confirmacionCorreo.codigosQR;

    expect(codigos).toHaveLength(2);

    codigos.forEach((codigo, indice) => {
      expect(codigo).toBe(
        `${respuesta.body.codigo}-${indice + 1}`
      );
    });

    const contenido = JSON.stringify(codigos);

    expect(contenido).not.toContain('40123456');
    expect(contenido).not.toContain('40222222');
    expect(contenido).not.toContain('ana@example.com');
  });
});