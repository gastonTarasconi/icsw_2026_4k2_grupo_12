function prepararConfirmacionCorreo(inscripcion, actividad) {
  return {
    destinatario: inscripcion.email,
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
}

module.exports = { prepararConfirmacionCorreo };