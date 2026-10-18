async function consultarApi(ruta, senal) {
  const respuesta = await fetch(`/api${ruta}`, { signal: senal });
  if (!respuesta.ok) throw new Error('No pudimos cargar la información. Intentá nuevamente.');
  return respuesta.json();
}

export function consultarActividades(senal) { return consultarApi('/actividades', senal); }
export function consultarTerminos(id, senal) { return consultarApi(`/actividades/${encodeURIComponent(id)}/terminos`, senal); }
