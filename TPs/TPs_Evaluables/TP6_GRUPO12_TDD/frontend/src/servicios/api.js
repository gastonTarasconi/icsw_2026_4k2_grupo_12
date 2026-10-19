async function consultarApi(ruta, senal, opciones = {}) {
  const respuesta = await fetch(`/api${ruta}`, { ...opciones, signal: senal });
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.mensaje || 'No pudimos completar la solicitud.');
  return datos;
}

export function consultarActividades(senal) {
  return consultarApi('/actividades', senal);
}

export function consultarTerminos(id, senal) {
  return consultarApi(`/actividades/${encodeURIComponent(id)}/terminos`, senal);
}

export function consultarTurnos(actividadId, fecha, senal) {
  return consultarApi(`/inscripciones/turnos?actividadId=${encodeURIComponent(actividadId)}&fecha=${encodeURIComponent(fecha)}`, senal);
}

export function registrarInscripcion(datos) {
  return consultarApi('/inscripciones', undefined, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
}
