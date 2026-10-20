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

  test('CA-01 - Falla: informa un error cuando no puede consultar el catalogo', async () => {
    const detalleInterno = 'SQLITE_IOERR: fallo interno al consultar actividades';
    const consulta = jest.spyOn(baseDeDatos, 'prepare').mockImplementationOnce(() => {
      throw new Error(detalleInterno);
    });

    try {
      const respuesta = await solicitud(aplicacion)
        .get('/api/actividades')
        .expect(500);

      expect(consulta).toHaveBeenCalled();
      expect(respuesta.body).toEqual({ mensaje: 'No pudimos completar la consulta.' });
      expect(Array.isArray(respuesta.body)).toBe(false);
      expect(respuesta.text).not.toContain(detalleInterno);
      expect(respuesta.text).not.toContain('SQLITE_IOERR');
    } finally {
      consulta.mockRestore();
    }
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

  test('la ruta de inscripción existe y valida datos', async () => {
    const respuesta = await solicitud(aplicacion).post('/api/inscripciones').send({}).expect(400);
    expect(respuesta.body.mensaje).toContain('actividad');
  });
});
