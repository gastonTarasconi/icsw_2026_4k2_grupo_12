const { crearHtmlCorreo } = require('./plantillaCorreo');

function prepararConfirmacionCorreo(inscripcion, actividad) {
  const mensaje = {
    destinatario: inscripcion.email,
    asunto: `🌿 ¡Tu lugar está reservado! ${actividad.nombre} — Eco Harmony Park`,
    texto: `¡Te esperamos en Eco Harmony Park!\n\nTu inscripción a ${actividad.nombre} está confirmada.\nFecha: ${inscripcion.fecha}\nHorario: ${inscripcion.horario} h\nParticipantes: ${inscripcion.cantidadPersonas}\nCódigo de confirmación: ${inscripcion.codigo}\n\nAdjuntamos un código QR por participante. Gracias por elegir compartir esta experiencia con nosotros.\nEquipo de Eco Harmony Park`,
    resumen: {
      codigo: inscripcion.codigo,
      actividad: actividad.nombre,
      fecha: inscripcion.fecha,
      horario: inscripcion.horario,
      cantidadPersonas: inscripcion.cantidadPersonas
    },
    participantes: inscripcion.participantes.map(
      participante => ({ ...participante })
    ),
    codigosQR: inscripcion.participantes.map(
      (_, i) => `${inscripcion.codigo}-${i + 1}`
    )
  };
  mensaje.html = crearHtmlCorreo(mensaje);
  return mensaje;
}

function crearCorreoSimulado() {
  const bandeja = [];
  return {
    async enviar(mensaje) {
      bandeja.push(structuredClone(mensaje));
      return { estado: 'simulado' };
    },
    listar: () => structuredClone(bandeja)
  };
}

module.exports = { prepararConfirmacionCorreo, crearCorreoSimulado };
