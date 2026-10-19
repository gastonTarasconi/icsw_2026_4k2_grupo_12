const { prepararConfirmacionCorreo } = require('../src/servicios/confirmacionCorreo');

describe('Presentación del correo', () => {
  test.each(['Safari', 'Palestra', 'Jardinería', 'Tirolesa'])('personaliza la confirmación de %s', nombre => {
    const correo = prepararConfirmacionCorreo({ codigo: 'reserva-1', email: 'ana@example.com',
      fecha: '2026-10-24', horario: '13:00', cantidadPersonas: 1,
      participantes: [{ nombre: '<img src=x onerror=alert(1)>', dni: '40123456', edad: 25 }] }, { nombre });
    expect(correo.asunto).toContain(nombre);
    expect(correo.texto).toContain(`Tu inscripción a ${nombre} está confirmada`);
    expect(correo.html).toContain(nombre);
    expect(correo.html).toContain('#386641');
    expect(correo.html).toContain('&lt;img');
    expect(correo.html).not.toContain('<img src=x');
    expect(correo.html).toContain('reserva-1-1');
  });
});
