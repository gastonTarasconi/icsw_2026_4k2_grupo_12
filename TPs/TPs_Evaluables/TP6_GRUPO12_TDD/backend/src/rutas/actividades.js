const { Router } = require('express');

function crearRutasActividades(repositorio) {
  const rutas = Router();
  rutas.get('/', (_solicitud, respuesta) => respuesta.json(repositorio.listarActividades()));
  rutas.get('/:id/terminos', (solicitud, respuesta) => {
    const terminos = repositorio.buscarTerminos(solicitud.params.id);
    if (!terminos) return respuesta.status(404).json({ mensaje: 'No encontramos esa actividad.' });
    respuesta.json(terminos);
  });
  return rutas;
}

module.exports = { crearRutasActividades };
