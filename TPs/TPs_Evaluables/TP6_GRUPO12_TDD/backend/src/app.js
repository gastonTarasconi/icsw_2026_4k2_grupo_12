const express = require('express');
const cors = require('cors');
const { crearRepositorioActividades } = require('./repositorios/actividades');
const { crearRutasActividades } = require('./rutas/actividades');

function crearAplicacion({ baseDeDatos, origenFrontend = 'http://localhost:5173' }) {
  const aplicacion = express();
  aplicacion.disable('x-powered-by');
  aplicacion.use(cors({ origin: origenFrontend }));
  aplicacion.use(express.json({ limit: '100kb' }));
  aplicacion.get('/api/salud', (_solicitud, respuesta) => respuesta.json({ estado: 'ok' }));
  aplicacion.use('/api/actividades', crearRutasActividades(crearRepositorioActividades(baseDeDatos)));
  aplicacion.use((_solicitud, respuesta) => respuesta.status(404).json({ mensaje: 'La ruta solicitada no existe.' }));
  aplicacion.use((error, _solicitud, respuesta, _siguiente) => {
    const datosInvalidos = error.type === 'entity.parse.failed';
    respuesta.status(datosInvalidos ? 400 : 500).json({
      mensaje: datosInvalidos ? 'El cuerpo de la solicitud no es JSON válido.' : 'No pudimos completar la consulta.'
    });
  });
  return aplicacion;
}

module.exports = { crearAplicacion };
