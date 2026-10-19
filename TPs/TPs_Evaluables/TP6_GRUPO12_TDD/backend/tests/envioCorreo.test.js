const request = require('supertest');
const { abrirBaseDeDatos } = require('../src/database/conexion');
const { inicializarBaseDeDatos } = require('../src/database/inicializar');
const { crearAplicacion } = require('../src/app');

describe('CA-16: envío de confirmación', () => {
  let db;
  let enviarCorreo;
  let app;
  const datos = () => ({ actividadId: 'tirolesa', fecha: '2026-10-24', horario: '10:00',
    cantidadPersonas: 1, participantes: [{ dni: '40123456', edad: 25, talla: 'M' }],
    aceptaTerminos: true, email: 'visitante@example.com' });

  beforeEach(() => {
    db = abrirBaseDeDatos(':memory:');
    inicializarBaseDeDatos(db);
    enviarCorreo = jest.fn(async () => ({ estado: 'simulado' }));
    app = crearAplicacion({ baseDeDatos: db, enviarCorreo,
      obtenerAhora: () => new Date('2026-10-24T09:00:00-03:00') });
  });
  afterEach(() => db.close());

  test('test_inscripción_a_actividad_CorreoConResumenYQR_Pasa', async () => {
    const { body } = await request(app).post('/api/inscripciones').send(datos()).expect(201);
    expect(enviarCorreo).toHaveBeenCalledTimes(1);
    expect(enviarCorreo).toHaveBeenCalledWith(expect.objectContaining({
      destinatario: datos().email, asunto: expect.any(String), texto: expect.any(String),
      resumen: expect.objectContaining({ codigo: body.codigo, actividad: 'Tirolesa' }),
      codigosQR: [`${body.codigo}-1`]
    }));
    expect(body.correo.estado).toBe('simulado');
    expect(body.confirmacionCorreo).toEqual(enviarCorreo.mock.calls[0][0]);
  });

  test('test_inscripción_a_actividad_CorreoDeInscripcionInvalida_NoPasa', async () => {
    await request(app).post('/api/inscripciones').send({ ...datos(), aceptaTerminos: false }).expect(400);
    expect(enviarCorreo).not.toHaveBeenCalled();
    expect(db.prepare('SELECT COUNT(*) AS n FROM inscripciones').get().n).toBe(0);
  });

  test('test_inscripción_a_actividad_ErrorDeCorreoSinPerderReserva_NoPasa', async () => {
    enviarCorreo.mockRejectedValue(new Error('credencial interna que no debe exponerse'));
    const { body } = await request(app).post('/api/inscripciones').send(datos()).expect(201);
    expect(body.correo.estado).toBe('error');
    expect(JSON.stringify(body)).not.toContain('credencial interna');
    await request(app).get(`/api/inscripciones/${body.codigo}`).expect(200);
    expect(db.prepare('SELECT COUNT(*) AS n FROM inscripciones').get().n).toBe(1);
  });
});
