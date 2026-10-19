
const request = require('supertest');

const { abrirBaseDeDatos } = require('../src/database/conexion');
const { inicializarBaseDeDatos } = require('../src/database/inicializar');
const { crearAplicacion } = require('../src/app');

describe('Inscribirme a actividad - Correo obligatorio', () => {
  let db;
  let app;
  let enviarCorreo;

  beforeEach(() => {
    db = abrirBaseDeDatos(':memory:');
    inicializarBaseDeDatos(db);

    enviarCorreo = jest.fn(async () => ({ estado: 'simulado' }));

    app = crearAplicacion({
      baseDeDatos: db,
      enviarCorreo,
      obtenerAhora: () =>
        new Date('2026-10-24T09:00:00-03:00')
    });
  });

  afterEach(() => {
    db.close();
  });

  const datosValidos = () => ({
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
  });

  test.each([
    ['ausente', undefined],
    ['nulo', null],
    ['vacio', ''],
    ['solo espacios', '   ']
  ])(
    'rechaza correo %s sin guardar ni enviar confirmacion',
    async (_caso, email) => {
      const datos = datosValidos();

      if (email === undefined) {
        delete datos.email;
      } else {
        datos.email = email;
      }

      const respuesta = await request(app)
        .post('/api/inscripciones')
        .send(datos);

      expect(respuesta.status).toBe(400);

      expect(respuesta.body).toEqual({
        mensaje: 'El correo electronico es obligatorio.'
      });

      const cantidad = db
        .prepare('SELECT COUNT(*) AS total FROM inscripciones')
        .get().total;

      expect(cantidad).toBe(0);
      expect(enviarCorreo).not.toHaveBeenCalled();
    }
  );
});
