
const request = require('supertest');

const {
  abrirBaseDeDatos
} = require('../src/database/conexion');

const {
  inicializarBaseDeDatos
} = require('../src/database/inicializar');

const {
  crearAplicacion
} = require('../src/app');

describe('Inscribirme a actividad - Validacion de formato de DNI erróneo (no 8 dígitos)', () => {
  let db;
  let app;

  beforeEach(() => {
    db = abrirBaseDeDatos(':memory:');
    inicializarBaseDeDatos(db);

    app = crearAplicacion({
      baseDeDatos: db,
      obtenerAhora: () =>
        new Date('2026-10-24T09:00:00-03:00')
    });
  });

  afterEach(() => {
    db.close();
  });

  test('rechaza un dni invalido sin guardar la inscripcion', async () => {
    const datos = {
      actividadId: 'tirolesa',
      fecha: '2026-10-24',
      horario: '10:00',
      cantidadPersonas: 1,
      participantes: [
        {
          nombre: 'Ana',
          dni: '2',
          edad: 25,
          talla: 'M'
        }
      ],
      aceptaTerminos: true,
      email: 'gaston.tarasconi@gmail.com'
    };

    const respuesta = await request(app)
      .post('/api/inscripciones')
      .send(datos);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.mensaje).toMatch('Cada participante debe ingresar un DNI formato numérico de 8 dígitos.');

    const cantidad = db
      .prepare('SELECT COUNT(*) AS total FROM inscripciones')
      .get().total;

    expect(cantidad).toBe(0);
  });
});

describe('Inscribirme a actividad - Validacion de formato de DNI correcto (8 dígitos)', () => {
  let db;
  let app;

  beforeEach(() => {
    db = abrirBaseDeDatos(':memory:');
    inicializarBaseDeDatos(db);

    app = crearAplicacion({
      baseDeDatos: db,
      obtenerAhora: () =>
        new Date('2026-10-24T09:00:00-03:00')
    });
  });

  afterEach(() => {
    db.close();
  });

  test('guarda la inscripcion ante un dni con formato valido', async () => {
    const datos = {
      actividadId: 'tirolesa',
      fecha: '2026-10-24',
      horario: '10:00',
      cantidadPersonas: 1,
      participantes: [
        {
          nombre: 'Ana',
          dni: '39933961',
          edad: 25,
          talla: 'M'
        }
      ],
      aceptaTerminos: true,
      email: 'gaston.tarasconi@gmail.com'
    };

    const respuesta = await request(app)
      .post('/api/inscripciones')
      .send(datos);

    expect(respuesta.status).toBe(201);

    const cantidad = db
      .prepare('SELECT COUNT(*) AS total FROM inscripciones')
      .get().total;

    expect(cantidad).toBe(1);
  });
});
