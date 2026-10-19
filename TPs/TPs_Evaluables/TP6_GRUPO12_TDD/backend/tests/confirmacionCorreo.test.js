
const {
  crearServicioInscripciones
} = require('../src/servicios/inscripciones');

describe('Inscribirme a actividad - Confirmacion por correo', () => {
  test('prepara el resumen y un QR por participante sin importes', async () => {
    const inscripcionesGuardadas = [];

    const repositorio = {
      buscarActividad: jest.fn(async () => ({
        id: 'tirolesa',
        nombre: 'Tirolesa',
        edadMinima: 8,
        requiereTalla: true
      })),

      buscarTurno: jest.fn(async () => ({
        capacidad: 10
      })),

      listarInscripciones: jest.fn(async () =>
        inscripcionesGuardadas
      ),

      guardarInscripcion: jest.fn(async inscripcion => {
        inscripcionesGuardadas.push(inscripcion);
      })
    };

    const servicio = crearServicioInscripciones({
      repositorio,
      obtenerAhora: () =>
        new Date('2026-10-24T09:00:00-03:00')
    });

    const resultado = await servicio.inscribir({
      actividadId: 'tirolesa',
      fecha: '2026-10-24',
      horario: '10:00',
      cantidadPersonas: 2,
      participantes: [
        {
          nombre: 'Ana',
          dni: '40123456',
          edad: 25,
          talla: 'M'
        },
        {
          nombre: 'Luis',
          dni: '40987654',
          edad: 24,
          talla: 'L'
        }
      ],
      aceptaTerminos: true,
      email: 'visitante@example.com'
    });

    const correo = resultado.confirmacionCorreo;

    expect(correo).toEqual(
      expect.objectContaining({
        destinatario: 'visitante@example.com',
        resumen: expect.objectContaining({
          codigo: resultado.codigo,
          actividad: 'Tirolesa',
          fecha: '2026-10-24',
          horario: '10:00',
          cantidadPersonas: 2
        })
      })
    );

    expect(correo.participantes).toHaveLength(2);

    expect(correo.codigosQR).toEqual([
      `${resultado.codigo}-1`,
      `${resultado.codigo}-2`
    ]);

    expect(JSON.stringify(correo)).not.toMatch(
      /subtotal|total|precio|importe|monto/i
    );
  });
});
