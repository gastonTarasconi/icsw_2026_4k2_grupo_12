const { crearCorreoSmtp } = require('../src/servicios/correoSmtp');

describe('Transporte SMTP sin conexión externa', () => {
  const mensaje = { destinatario: 'visitante@example.com', asunto: 'Confirmación',
    texto: 'Reserva confirmada', html: '<p>Reserva confirmada</p>', participantes: [{ nombre: 'Ana', dni: '40123456', edad: 25 }], codigosQR: ['token-1'] };

  test('test_inscripción_a_actividad_SmtpAceptaMensaje_Pasa', async () => {
    const transporte = { sendMail: jest.fn(async () => ({ accepted: [mensaje.destinatario], messageId: 'id-1' })) };
    const enviar = crearCorreoSmtp({ transporte, remitente: 'parque@example.com' });
    await expect(enviar(mensaje)).resolves.toEqual({ estado: 'aceptado' });
    expect(transporte.sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: { name: 'Eco Harmony Park', address: 'parque@example.com' }, to: mensaje.destinatario, subject: mensaje.asunto,
      html: mensaje.html,
      text: expect.stringContaining('token-1'),
      attachments: [expect.objectContaining({ filename: 'qr-1.png', content: expect.any(Buffer) })]
    }));
  });

  test('test_inscripción_a_actividad_SmtpRechazaDestinatario_NoPasa', async () => {
    const transporte = { sendMail: jest.fn(async () => ({ accepted: [], rejected: [mensaje.destinatario] })) };
    await expect(crearCorreoSmtp({ transporte, remitente: 'parque@example.com' })(mensaje))
      .rejects.toThrow('El servidor no aceptó el destinatario.');
  });
});
