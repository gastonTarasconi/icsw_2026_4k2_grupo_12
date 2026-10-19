
const request = require('supertest');
const { abrirBaseDeDatos } = require('../src/database/conexion');
const { inicializarBaseDeDatos } = require('../src/database/inicializar');
const { crearAplicacion } = require('../src/app');

describe('Inscripciones - Concurrencia de cupos', () => {
  let db;
  let app;
  let enviarCorreo;

  beforeEach(() => {
    db = abrirBaseDeDatos(':memory:');
    inicializarBaseDeDatos(db);

    enviarCorreo = jest.fn(async () => ({
      estado: 'simulado'
    }));

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

  const persona = dni => ({
    nombre: 'Visitante',
    dni,
    edad: 25,
    talla: 'M'
  });

  const datos = (participantes, email) => ({
    actividadId: 'tirolesa',
    fecha: '2026-10-24',
    horario: '10:00',
    cantidadPersonas: participantes.length,
    participantes,
    aceptaTerminos: true,
    email
  });

  test('dos solicitudes por el ultimo cupo permiten solo una reserva', async () => {
    // Tirolesa tiene 10 cupos. Primero ocupamos 9.
    const primerosNueve = Array.from(
      { length: 9 },
      (_, i) => persona(String(30000000 + i))
    );

    await request(app)
      .post('/api/inscripciones')
      .send(datos(primerosNueve, 'grupo@example.com'))
      .expect(201);

    // Dos personas intentan ocupar el unico lugar restante.
    const [respuesta1, respuesta2] = await Promise.all([
      request(app)
        .post('/api/inscripciones')
        .send(datos(
          [persona('41000001')],
          'primera@example.com'
        )),

      request(app)
        .post('/api/inscripciones')
        .send(datos(
          [persona('41000002')],
          'segunda@example.com'
        ))
    ]);

    // Una solicitud debe aceptarse y la otra rechazarse.
    const estados = [
      respuesta1.status,
      respuesta2.status
    ].sort((a, b) => a - b);

    expect(estados).toEqual([201, 409]);

    const rechazada = [respuesta1, respuesta2]
      .find(respuesta => respuesta.status === 409);

    expect(rechazada.body.mensaje).toMatch(/cupo/i);

    // Comprobamos que la base no haya superado la capacidad.
    const ocupacion = db.prepare(`
      SELECT COALESCE(SUM(cantidad_personas), 0) AS total
      FROM inscripciones
      WHERE actividad_id = ?
        AND fecha = ?
        AND horario = ?
    `).get('tirolesa', '2026-10-24', '10:00');

    expect(ocupacion.total).toBe(10);

    // Deben existir solo dos inscripciones:
    // el grupo de 9 y la persona que obtuvo el ultimo cupo.
    const cantidad = db.prepare(`
      SELECT COUNT(*) AS total FROM inscripciones
    `).get();

    expect(cantidad.total).toBe(2);

    expect(enviarCorreo).toHaveBeenCalledTimes(2);
  });
});