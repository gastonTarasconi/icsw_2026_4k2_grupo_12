const { crearRepositorioActividades } = require('./actividades');

function crearRepositorioInscripciones(db) {
  const repoActividades = crearRepositorioActividades(db);
  const aInscripcion = fila => ({
    codigo: fila.codigo,
    actividadId: fila.actividad_id,
    fecha: fila.fecha,
    horario: fila.horario,
    cantidadPersonas: fila.cantidad_personas,
    participantes: JSON.parse(fila.participantes),
    aceptaTerminos: Boolean(fila.acepta_terminos),
    email: fila.email
  });
  const listar = () => db.prepare('SELECT * FROM inscripciones').all().map(aInscripcion);

  return {
    buscarActividad(id) {
      return repoActividades.listarActividades().find(a => a.id === id);
    },
    buscarTurno(actividadId, fecha, horario) {
      const actividad = repoActividades.listarActividades().find(a => a.id === actividadId);
      if (!actividad || !/^(09|10|11|12|13|14|15|16|17):00$/.test(horario)) return null;
      return { actividadId, fecha, horario, capacidad: actividad.capacidad };
    },
    listarInscripciones: listar,
    guardarInscripcion(inscripcion) {
      // Revalidación atómica para impedir reservas simultáneas sobre el último cupo.
      db.exec('BEGIN IMMEDIATE');
      try {
        const ocupados = db.prepare(`SELECT COALESCE(SUM(cantidad_personas), 0) AS total
          FROM inscripciones WHERE actividad_id = ? AND fecha = ? AND horario = ?`)
          .get(inscripcion.actividadId, inscripcion.fecha, inscripcion.horario).total;
        const actividad = repoActividades.listarActividades().find(a => a.id === inscripcion.actividadId);
        if (!actividad || ocupados + inscripcion.cantidadPersonas > actividad.capacidad) {
          throw new Error('No hay cupos disponibles para esta actividad.');
        }
        const mismaHora = db.prepare('SELECT participantes FROM inscripciones WHERE fecha = ? AND horario = ?')
          .all(inscripcion.fecha, inscripcion.horario);
        const dniActuales = new Set(inscripcion.participantes.map(p => p.dni));
        if (mismaHora.some(fila => JSON.parse(fila.participantes).some(p => dniActuales.has(p.dni)))) {
          throw new Error('El DNI ya tiene una inscripcion con superposicion horaria.');
        }
        db.prepare(`INSERT INTO inscripciones
          (codigo, actividad_id, fecha, horario, cantidad_personas, participantes, acepta_terminos, email)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
          .run(inscripcion.codigo, inscripcion.actividadId, inscripcion.fecha, inscripcion.horario,
            inscripcion.cantidadPersonas, JSON.stringify(inscripcion.participantes),
            Number(inscripcion.aceptaTerminos), inscripcion.email);
        db.exec('COMMIT');
      } catch (error) {
        db.exec('ROLLBACK');
        throw error;
      }
    },
    cuposDisponibles(actividadId, fecha, horario) {
      const actividad = repoActividades.listarActividades().find(a => a.id === actividadId);
      if (!actividad) return null;
      const ocupados = db.prepare(`SELECT COALESCE(SUM(cantidad_personas), 0) AS total
        FROM inscripciones WHERE actividad_id = ? AND fecha = ? AND horario = ?`)
        .get(actividadId, fecha, horario).total;
      return Math.max(0, actividad.capacidad - ocupados);
    },
    buscarInscripcion(codigo) {
      const fila = db.prepare('SELECT * FROM inscripciones WHERE codigo = ?').get(codigo);
      return fila ? aInscripcion(fila) : null;
    }
  };
}

module.exports = { crearRepositorioInscripciones };
