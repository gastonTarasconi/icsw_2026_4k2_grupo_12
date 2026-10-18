const { randomUUID } = require('node:crypto');

function crearServicioInscripciones({ repositorio }) {
  return {
    async inscribir(datosInscripcion) {
      const actividad = await repositorio.buscarActividad(datosInscripcion.actividadId);
      const inscripcion = {
        ...datosInscripcion,
        codigo: randomUUID()
      };

      await repositorio.guardarInscripcion(inscripcion);

      return { ...inscripcion, actividad };
    }
  };
}

module.exports = { crearServicioInscripciones };
