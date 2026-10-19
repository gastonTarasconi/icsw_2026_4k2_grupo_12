import React, { useEffect, useRef, useState } from 'react';
import { consultarTerminos } from '../servicios/api';
import InscripcionActividad from './InscripcionActividad';

export default function TerminosActividad({ actividad, alVolver }) {
  const [terminos, cambiarTerminos] = useState(null);
  const [error, cambiarError] = useState('');
  const [intento, cambiarIntento] = useState(0);
  const ventanaTerminos = useRef(null);

  useEffect(() => {
    const controlador = new AbortController();
    cambiarTerminos(null);
    cambiarError('');
    consultarTerminos(actividad.id, controlador.signal)
      .then(cambiarTerminos)
      .catch(error => {
        if (error.name !== 'AbortError') cambiarError(error.message);
      });
    return () => controlador.abort();
  }, [actividad.id, intento]);

  return <section className="terminos" aria-labelledby="titulo-terminos">
    <button className="volver" onClick={alVolver}>← Todas las actividades</button>
    <p className="etiqueta">Elegí tu experiencia</p>
    <h2 id="titulo-terminos">{actividad.nombre}</h2>
    <p className="descripcion-reserva">Elegí un turno y reservá tu lugar. Antes de confirmar, podés consultar los términos y condiciones específicos de esta actividad.</p>

    {error && <div role="alert">
      <p>{error}</p>
      <button onClick={() => cambiarIntento(intento + 1)}>Reintentar</button>
    </div>}
    {!terminos && !error && <p role="status">Cargando condiciones de la actividad…</p>}

    {terminos && <>
      <aside className="acceso-terminos" aria-label="Consultar condiciones">
        <div>
          <strong>Términos y condiciones</strong>
          <p>Consultá las normas del parque y los requisitos de {actividad.nombre} cuando lo necesites.</p>
        </div>
        <button className="boton-abrir-terminos" type="button" onClick={() => ventanaTerminos.current?.showModal()}>
          Leer términos y condiciones ↗
        </button>
      </aside>

      <InscripcionActividad actividad={actividad} />

      <dialog ref={ventanaTerminos} className="ventana-terminos" aria-labelledby="titulo-ventana-terminos">
        <div className="ventana-terminos-cabecera">
          <div>
            <p className="etiqueta">Antes de participar</p>
            <h2 id="titulo-ventana-terminos">Términos de {actividad.nombre}</h2>
          </div>
          <button className="cerrar-terminos" type="button" aria-label="Cerrar términos y condiciones" onClick={() => ventanaTerminos.current?.close()}>×</button>
        </div>
        <div className="ventana-terminos-cuerpo">
          <h3>Condiciones generales de inscripción</h3>
          <p className="texto-terminos">{terminos.generales}</p>
          <h3>Condiciones de la actividad</h3>
          <p className="texto-terminos">{terminos.especificos.replace('Condiciones particulares propuestas para validación', 'Condiciones particulares')}</p>
          <a className="enlace-documento" href="/terminos-y-condiciones.pdf" target="_blank" rel="noreferrer">Abrir documento original (PDF) ↗</a>
        </div>
        <div className="ventana-terminos-pie">
          <button type="button" onClick={() => ventanaTerminos.current?.close()}>Volver al formulario</button>
        </div>
      </dialog>
    </>}
  </section>;
}
