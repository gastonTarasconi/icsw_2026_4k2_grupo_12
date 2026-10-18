import React, { useEffect, useState } from 'react';
import { consultarTerminos } from '../servicios/api';

export default function TerminosActividad({ actividad, alVolver }) {
  const [terminos, cambiarTerminos] = useState(null);
  const [error, cambiarError] = useState('');
  const [intento, cambiarIntento] = useState(0);
  useEffect(() => {
    const controlador = new AbortController();
    cambiarTerminos(null);
    cambiarError('');
    consultarTerminos(actividad.id, controlador.signal).then(cambiarTerminos).catch(error => {
      if (error.name !== 'AbortError') cambiarError(error.message);
    });
    return () => controlador.abort();
  }, [actividad.id, intento]);

  return <section className="terminos" aria-labelledby="titulo-terminos">
    <button className="volver" onClick={alVolver}>← Todas las actividades</button>
    <p className="etiqueta">Antes de participar</p>
    <h2 id="titulo-terminos">Términos de {actividad.nombre}</h2>
    {error && <div role="alert"><p>{error}</p><button onClick={() => cambiarIntento(intento + 1)}>Reintentar</button></div>}
    {!terminos && !error && <p role="status">Cargando términos…</p>}
    {terminos && <>
      <h3>Condiciones generales de inscripción</h3><p className="texto-terminos">{terminos.generales}</p>
      <h3>Condiciones de la actividad</h3><p className="texto-terminos">{terminos.especificos.replace('Condiciones particulares propuestas para validación', 'Condiciones particulares')}</p>
    </>}
    <a className="enlace-documento" href="/terminos-y-condiciones.pdf" target="_blank" rel="noreferrer">Abrir documento original (PDF) ↗</a>
    <div className="pendiente"><strong>Inscripciones próximamente</strong><p>La consulta de turnos y la inscripción todavía no están disponibles.</p><button disabled>Seleccionar turno</button></div>
  </section>;
}
