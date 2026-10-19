const QRCode = require('qrcode');

function crearCorreoSmtp({ transporte, remitente }) {
  return async mensaje => {
    const attachments = await Promise.all(mensaje.codigosQR.map(async (token, i) => ({
      filename: `qr-${i + 1}.png`,
      content: await QRCode.toBuffer(token, { width: 192, margin: 2 }),
      contentType: 'image/png'
    })));
    const participantes = mensaje.participantes.map((p, i) =>
      `Participante ${i + 1}: ${p.nombre || 'Sin nombre'}, DNI ${p.dni}, edad ${p.edad}${p.talla ? `, talla ${p.talla}` : ''}. QR: ${mensaje.codigosQR[i]}`);
    const resultado = await transporte.sendMail({
      from: { name: 'Eco Harmony Park', address: remitente }, to: mensaje.destinatario, subject: mensaje.asunto,
      text: [mensaje.texto, ...participantes].join('\n'), html: mensaje.html, attachments
    });
    if (!resultado.accepted?.some(email => email.toLowerCase() === mensaje.destinatario.toLowerCase())) {
      throw new Error('El servidor no aceptó el destinatario.');
    }
    return { estado: 'aceptado' };
  };
}

module.exports = { crearCorreoSmtp };
