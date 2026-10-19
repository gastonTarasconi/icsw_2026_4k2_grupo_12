
const { Router } = require('express');
const { crearServicioInscripciones } = require('../servicios/inscripciones');

// Prepara el resumen publico sin exponer datos personales.
function resumirInscripcion(inscripcion) {
  return {
    codigo: inscripcion.codigo,
    actividadId: inscripcion.actividadId,
    fecha: inscripcion.fecha,
    horario: inscripcion.horario,
    cantidadPersonas: inscripcion.cantidadPersonas
  };
}

function crearRutasInscripciones(repositorio, obtenerAhora = () => new Date(), enviarCorreo) {
  const rutas = Router();
  const servicio = crearServicioInscripciones({
    repositorio,
    obtenerAhora,
    enviarCorreo
  });

  rutas.get('/turnos', async (req, res) => {
    const { actividadId, fecha } = req.query;

    if (typeof actividadId !== 'string' || typeof fecha !== 'string' ||
        !/^\d{4}-\d{2}-\d{2}$/.test(fecha) ||
        Number.isNaN(new Date(`${fecha}T12:00:00Z`).getTime()) ||
        new Date(`${fecha}T12:00:00Z`).toISOString().slice(0, 10) !== fecha) {
      return res.status(400).json({
        mensaje: 'Elegí una actividad y fecha válidas.'
      });
    }

    const actividad = await repositorio.buscarActividad(actividadId);

    if (!actividad) {
      return res.status(404).json({
        mensaje: 'La actividad no existe.'
      });
    }

    const cerrado = new Date(`${fecha}T12:00:00Z`).getUTCDay() === 1 ||
      fecha.endsWith('-12-25') || fecha.endsWith('-01-01');

    const ahora = obtenerAhora().getTime();

    const turnos = Array.from({ length: 9 }, (_, i) => {
      const horario = `${String(i + 9).padStart(2, '0')}:00`;
      const inicio = new Date(`${fecha}T${horario}:00-03:00`).getTime();
      const anticipacion = inicio - ahora;

      const cuposDisponibles = repositorio.cuposDisponibles(
        actividadId,
        fecha,
        horario
      );

      return {
        horario,
        cuposDisponibles,
        disponible: !cerrado && cuposDisponibles > 0 &&
          anticipacion >= 15 * 60 * 1000 &&
          anticipacion <= 24 * 60 * 60 * 1000
      };
    });

    res.json({ fecha, cerrado, turnos });
  });

  rutas.post('/', async (req, res) => {
    try {
      const resultado = await servicio.inscribir(req.body ?? {});

      res.status(201).json({
        codigo: resultado.codigo,
        actividad: resultado.actividad.nombre,
        fecha: resultado.fecha,
        horario: resultado.horario,
        cantidadPersonas: resultado.cantidadPersonas,
        participantes: resultado.participantes,
        correoSimulado: resultado.email,
        confirmacionCorreo: resultado.confirmacionCorreo,
        correo: resultado.correo
      });
    } catch (error) {
      const mensaje = error.message ||
        'No se pudo completar la inscripción.';

      const conflicto = /cupo|superposicion/i.test(mensaje);

      res.status(conflicto ? 409 : 400).json({ mensaje });
    }
  });

  // Consulta una inscripcion devolviendo solamente su resumen publico.
  rutas.get('/:codigo', (req, res) => {
    const inscripcion = repositorio.buscarInscripcion(
      req.params.codigo
    );

    if (!inscripcion) {
      return res.status(404).json({
        mensaje: 'Inscripción no encontrada.'
      });
    }

    res.json(resumirInscripcion(inscripcion));
  });

  return rutas;
}

module.exports = { crearRutasInscripciones };
