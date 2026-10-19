
const { randomUUID } = require('node:crypto');
const { prepararConfirmacionCorreo, crearCorreoSimulado } = require('./confirmacionCorreo');

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const UNA_HORA = 60 * 60 * 1000;
const UN_MINUTO = 60 * 1000;

// Calcula los cupos ocupados de una actividad y turno.
function contarCuposOcupados(inscripciones, actividadId, fecha, horario) {
  return inscripciones
    .filter(inscripcion =>
      inscripcion.actividadId === actividadId &&
      inscripcion.fecha === fecha &&
      inscripcion.horario === horario
    )
    .reduce(
      (total, inscripcion) => total + inscripcion.cantidadPersonas,
      0
    );
}

// Comprueba que la fecha tenga un formato valido.
function fechaValida(fecha) {
  if (
    typeof fecha !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
  ) {
    return false;
  }

  const valor = new Date(`${fecha}T12:00:00Z`);

  return (
    !Number.isNaN(valor.getTime()) &&
    valor.toISOString().slice(0, 10) === fecha
  );
}

// Obtiene el inicio del turno en hora argentina.
function inicioTurno(fecha, horario) {
  return new Date(
    `${fecha}T${horario}:00-03:00`
  ).getTime();
}

// Valida los datos de todos los participantes.
function validarParticipantes(datos, actividad) {
  const { cantidadPersonas, participantes } = datos;

  if (
    !Number.isInteger(cantidadPersonas) ||
    cantidadPersonas <= 0 ||
    !Array.isArray(participantes) ||
    participantes.length !== cantidadPersonas
  ) {
    throw new Error(
      'La cantidad de participantes no coincide con los datos ingresados.'
    );
  }

  const dniRegistrados = new Set();

  for (const participante of participantes) {
    // Validar DNI.
    if (
      typeof participante.dni !== 'string' ||
      !/^\d+$/.test(participante.dni)
    ) {
      throw new Error(
        'Cada participante debe ingresar un DNI numerico.'
      );
    }

    // Evitar repetir participantes.
    if (dniRegistrados.has(participante.dni)) {
      throw new Error(
        'No se puede repetir un DNI en la misma inscripcion.'
      );
    }

    dniRegistrados.add(participante.dni);

    // Validar edad.
    if (
      !Number.isInteger(participante.edad) ||
      participante.edad < 0 ||
      participante.edad < actividad.edadMinima
    ) {
      throw new Error(
        `La edad del participante no es valida para ${actividad.nombre}.`
      );
    }

    // Validar talle cuando corresponda.
    if (
      actividad.requiereTalla &&
      !TALLAS.includes(participante.talla)
    ) {
      throw new Error(
        'Es obligatorio indicar una talla valida para esta actividad.'
      );
    }
  }
}

// Valida fecha, horario y anticipacion.
function validarTurno(datos, ahora) {
  const { fecha, horario } = datos;

  if (!fechaValida(fecha)) {
    throw new Error(
      'La fecha seleccionada no es valida.'
    );
  }

  // Los turnos comienzan de 09:00 a 17:00.
  if (
    typeof horario !== 'string' ||
    !/^(09|10|11|12|13|14|15|16|17):00$/.test(horario)
  ) {
    throw new Error(
      'El horario debe estar entre las 09:00 y las 17:00.'
    );
  }

  const fechaLocal = new Date(`${fecha}T12:00:00Z`);

  // El parque no abre los lunes, Navidad ni Año Nuevo.
  if (
    fechaLocal.getUTCDay() === 1 ||
    fecha.endsWith('-12-25') ||
    fecha.endsWith('-01-01')
  ) {
    throw new Error(
      'El parque esta cerrado en la fecha seleccionada.'
    );
  }

  const inicio = inicioTurno(fecha, horario);
  const anticipacion = inicio - ahora.getTime();

  // Solo se permite reservar entre 24 h y 15 min antes.
  if (
    anticipacion > 24 * UNA_HORA ||
    anticipacion < 15 * UN_MINUTO
  ) {
    throw new Error(
      'La anticipacion permitida es de 24 horas a 15 minutos.'
    );
  }

  return inicio;
}

// Impide que un DNI participe en actividades superpuestas.
function validarSuperposiciones(inscripciones, datos, inicio) {
  const dniNuevos = new Set(
    datos.participantes.map(participante => participante.dni)
  );

  for (const inscripcion of inscripciones) {
    if (!Array.isArray(inscripcion.participantes)) {
      continue;
    }

    const existeMismoDNI = inscripcion.participantes.some(
      participante => dniNuevos.has(participante.dni)
    );

    if (!existeMismoDNI) {
      continue;
    }

    const inicioExistente = inicioTurno(
      inscripcion.fecha,
      inscripcion.horario
    );

    if (Math.abs(inicio - inicioExistente) < UNA_HORA) {
      throw new Error(
        'El DNI ya tiene una inscripcion con superposicion horaria.'
      );
    }
  }
}

// Servicio principal de inscripciones.
function crearServicioInscripciones({
  repositorio,
  obtenerAhora = () => new Date(),
  enviarCorreo = crearCorreoSimulado().enviar
}) {
  return {
    async inscribir(datosInscripcion) {
      // 1. Buscar la actividad.
      const actividad = await repositorio.buscarActividad(
        datosInscripcion.actividadId
      );

      if (!actividad) {
        throw new Error('La actividad no existe.');
      }

      // 2. Validar terminos y condiciones.
      if (datosInscripcion.aceptaTerminos !== true) {
        throw new Error(
          'Es necesario aceptar los terminos de la actividad.'
        );
      }

      // 3. Validar participantes.
      validarParticipantes(datosInscripcion, actividad);

      // 4. Validar fecha, horario y anticipacion.
      const inicio = validarTurno(
        datosInscripcion,
        obtenerAhora()
      );

      // 5. Buscar el turno seleccionado.
      const turno = await repositorio.buscarTurno(
        datosInscripcion.actividadId,
        datosInscripcion.fecha,
        datosInscripcion.horario
      );

      if (!turno) {
        throw new Error(
          'El turno solicitado no existe.'
        );
      }

      // 6. Consultar las inscripciones existentes.
      const inscripciones =
        await repositorio.listarInscripciones();

      // 7. Calcular los cupos ocupados.
      const cuposOcupados = contarCuposOcupados(
        inscripciones,
        datosInscripcion.actividadId,
        datosInscripcion.fecha,
        datosInscripcion.horario
      );

      // 8. Verificar disponibilidad.
      if (
        cuposOcupados + datosInscripcion.cantidadPersonas >
        turno.capacidad
      ) {
        throw new Error(
          'No hay cupos disponibles para esta actividad.'
        );
      }

      // 9. Controlar superposiciones.
      validarSuperposiciones(
        inscripciones,
        datosInscripcion,
        inicio
      );

      // 10. Crear la inscripcion.
      const inscripcion = {
        ...datosInscripcion,
        codigo: randomUUID()
      };

      // 11. Guardar.
      await repositorio.guardarInscripcion(inscripcion);

      // 12. Preparar la confirmacion.
      const confirmacionCorreo = prepararConfirmacionCorreo(
        inscripcion,
        actividad
      );
      let correo;
      try {
        correo = await enviarCorreo(confirmacionCorreo);
      } catch {
        correo = { estado: 'error' };
      }

      // 13. Devolver la confirmacion.
      return {
        ...inscripcion,
        actividad,
        confirmacionCorreo,
        correo
      };
    }
  };
}

module.exports = { crearServicioInscripciones };
