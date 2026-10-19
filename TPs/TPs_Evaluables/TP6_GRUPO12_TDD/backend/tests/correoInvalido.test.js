
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

describe('Inscribirme a actividad - Validacion del correo', () => {
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

  test('rechaza un email invalido sin guardar la inscripcion', async () => {
    const datos = {
      actividadId: 'tirolesa',
      fecha: '2026-10-24',
      horario: '10:00',
      cantidadPersonas: 1,
      participantes: [
        {
          nombre: 'Ana',
          dni: '40123456',
          edad: 25,
          talla: 'M'
        }
      ],
      aceptaTerminos: true,
      email: 'correo-sin-arroba'
    };

    const respuesta = await request(app)
      .post('/api/inscripciones')
      .send(datos);

    expect(respuesta.status).toBe(400);
    expect(respuesta.body.mensaje).toMatch(/correo|email/i);

    const cantidad = db
      .prepare('SELECT COUNT(*) AS total FROM inscripciones')
      .get().total;

    expect(cantidad).toBe(0);
  });
});
