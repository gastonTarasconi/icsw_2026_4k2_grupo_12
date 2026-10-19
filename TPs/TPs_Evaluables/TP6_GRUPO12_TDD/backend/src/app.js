const express = require('express');
const cors = require('cors');
const { crearRepositorioActividades } = require('./repositorios/actividades');
const { crearRutasActividades } = require('./rutas/actividades');
const { crearRepositorioInscripciones } = require('./repositorios/inscripciones');
const { crearRutasInscripciones } = require('./rutas/inscripciones');

function crearAplicacion({ baseDeDatos, origenFrontend = 'http://localhost:5173', obtenerAhora, enviarCorreo }) {
  const aplicacion = express();
  aplicacion.disable('x-powered-by');
  aplicacion.use(cors({ origin: origenFrontend }));
  aplicacion.use(express.json({ limit: '100kb' }));
  aplicacion.get('/api/salud', (_req, res) => res.json({ estado: 'ok' }));
  aplicacion.use('/api/actividades', crearRutasActividades(crearRepositorioActividades(baseDeDatos)));
  aplicacion.use('/api/inscripciones', crearRutasInscripciones(
    crearRepositorioInscripciones(baseDeDatos), obtenerAhora, enviarCorreo));
  aplicacion.use((_req, res) => res.status(404).json({ mensaje: 'La ruta solicitada no existe.' }));
  aplicacion.use((error, _req, res, _next) => {
    const datosInvalidos = error.type === 'entity.parse.failed';
    res.status(datosInvalidos ? 400 : 500).json({
      mensaje: datosInvalidos ? 'El cuerpo de la solicitud no es JSON válido.' : 'No pudimos completar la consulta.'
    });
  });
  return aplicacion;
}

module.exports = { crearAplicacion };
