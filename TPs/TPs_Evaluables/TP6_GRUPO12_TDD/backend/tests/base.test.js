const solicitud = require('supertest');
const { abrirBaseDeDatos } = require('../src/database/conexion');
const { inicializarBaseDeDatos } = require('../src/database/inicializar');
const { crearAplicacion } = require('../src/app');

describe('Base del sistema', () => {
  let baseDeDatos;
  let aplicacion;
  beforeEach(() => {
    baseDeDatos = abrirBaseDeDatos(':memory:');
    inicializarBaseDeDatos(baseDeDatos);
    aplicacion = crearAplicacion({ baseDeDatos });
  });
  afterEach(() => baseDeDatos.close());

  test('inicializar dos veces no duplica las actividades', async () => {
    inicializarBaseDeDatos(baseDeDatos);
    const respuesta = await solicitud(aplicacion).get('/api/actividades').expect(200);
    expect(respuesta.body.map(actividad => actividad.nombre)).toEqual(['Safari', 'Palestra', 'Jardinería', 'Tirolesa']);
    expect(respuesta.body.map(actividad => actividad.capacidad)).toEqual([8, 12, 12, 10]);
  });

  test('consulta los términos de cada actividad desde SQLite', async () => {
    for (const id of ['safari', 'palestra', 'jardineria', 'tirolesa']) {
      const respuesta = await solicitud(aplicacion).get(`/api/actividades/${id}/terminos`).expect(200);
      expect(respuesta.body.generales).toContain('24 horas');
      expect(respuesta.body.especificos).toContain('Condiciones confirmadas');
      expect(respuesta.body.estado).toContain('pendiente de validación');
    }
  });

  test('informa cuando una actividad no existe', async () => {
    const respuesta = await solicitud(aplicacion).get('/api/actividades/inexistente/terminos').expect(404);
    expect(respuesta.body.mensaje).toBe('No encontramos esa actividad.');
  });

  test('la historia de inscripción todavía no está implementada', async () => {
    await solicitud(aplicacion).post('/api/inscripciones').send({}).expect(404);
  });
});
