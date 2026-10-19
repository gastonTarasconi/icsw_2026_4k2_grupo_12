
const request = require('supertest');
const { abrirBaseDeDatos } = require('../src/database/conexion');
const { inicializarBaseDeDatos } = require('../src/database/inicializar');
const { crearAplicacion } = require('../src/app');

describe('Privacidad de las inscripciones', () => {
  let db;
  let app;

  beforeEach(() => {
    db = abrirBaseDeDatos(':memory:');
    inicializarBaseDeDatos(db);

    app = crearAplicacion({
      baseDeDatos: db,
      obtenerAhora: () =>
        new Date('2026-10-24T09:00:00-03:00'),
      enviarCorreo: async () => ({ estado: 'simulado' })
    });
  });

  afterEach(() => {
    db.close();
  });

  test('la consulta devuelve un resumen sin datos personales', async () => {
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
      email: 'ana@example.com'
    };

    const creada = await request(app)
      .post('/api/inscripciones')
      .send(datos)
      .expect(201);

    const consulta = await request(app)
      .get(`/api/inscripciones/${creada.body.codigo}`)
      .expect(200);

    expect(consulta.body).toEqual({
      codigo: creada.body.codigo,
      actividadId: 'tirolesa',
      fecha: '2026-10-24',
      horario: '10:00',
      cantidadPersonas: 1
    });
  });
});