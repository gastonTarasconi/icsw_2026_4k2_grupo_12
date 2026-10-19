const request = require('supertest');
const { abrirBaseDeDatos } = require('../src/database/conexion');
const { inicializarBaseDeDatos } = require('../src/database/inicializar');
const { crearAplicacion } = require('../src/app');

describe('Inscripción a través de API y SQLite', () => {
  let db;
  let app;
  const datos = () => ({ actividadId: 'tirolesa', fecha: '2026-10-24', horario: '10:00',
    cantidadPersonas: 1, participantes: [{ nombre: 'Ana', dni: '40123456', edad: 25, talla: 'M' }],
    aceptaTerminos: true, email: 'ana@example.com' });
  beforeEach(() => {
    db = abrirBaseDeDatos(':memory:');
    inicializarBaseDeDatos(db);
    app = crearAplicacion({ baseDeDatos: db,
      obtenerAhora: () => new Date('2026-10-24T09:00:00-03:00') });
  });
  afterEach(() => db.close());

  test('publica los horarios disponibles desde SQLite', async () => {
    const r = await request(app).get('/api/inscripciones/turnos')
      .query({ actividadId: 'tirolesa', fecha: '2026-10-24' }).expect(200);
    expect(r.body.turnos.find(t => t.horario === '10:00')).toEqual(
      expect.objectContaining({ cuposDisponibles: 10, disponible: true }));
  });
  test('guarda y consulta una inscripción real', async () => {
    const r = await request(app).post('/api/inscripciones').send(datos()).expect(201);
    expect(r.body.codigo).toEqual(expect.any(String));
    const consulta = await request(app).get(`/api/inscripciones/${r.body.codigo}`).expect(200);
    expect(consulta.body.participantes[0].dni).toBe('40123456');
    const turnos = await request(app).get('/api/inscripciones/turnos')
      .query({ actividadId: 'tirolesa', fecha: '2026-10-24' }).expect(200);
    expect(turnos.body.turnos.find(t => t.horario === '10:00').cuposDisponibles).toBe(9);
  });
  test('no inscribe dos veces el mismo DNI en el mismo turno', async () => {
    await request(app).post('/api/inscripciones').send(datos()).expect(201);
    await request(app).post('/api/inscripciones').send(datos()).expect(409);
  });
  test('rechaza menores y no guarda inscripciones inválidas', async () => {
    const invalido = datos();
    invalido.participantes[0].edad = 7;
    await request(app).post('/api/inscripciones').send(invalido).expect(400);
    expect(db.prepare('SELECT COUNT(*) AS n FROM inscripciones').get().n).toBe(0);
  });
  test('muestra cerrados los lunes', async () => {
    const r = await request(app).get('/api/inscripciones/turnos')
      .query({ actividadId: 'tirolesa', fecha: '2026-10-26' }).expect(200);
    expect(r.body.cerrado).toBe(true);
    expect(r.body.turnos.every(t => !t.disponible)).toBe(true);
  });
});
