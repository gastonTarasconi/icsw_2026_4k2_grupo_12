import React, { useEffect, useState } from 'react';
import { consultarActividades } from './servicios/api';
import TerminosActividad from './componentes/TerminosActividad';

const ilustraciones = { safari: '↟', palestra: '△', jardineria: '❧', tirolesa: '↗' };

export default function App() {
  const [actividades, cambiarActividades] = useState([]);
  const [seleccionada, seleccionarActividad] = useState(null);
  const [cargando, cambiarCarga] = useState(true);
  const [error, cambiarError] = useState('');
  const [intento, cambiarIntento] = useState(0);
  useEffect(() => {
    const controlador = new AbortController();
    cambiarCarga(true);
    cambiarError('');
    consultarActividades(controlador.signal).then(cambiarActividades).catch(error => {
      if (error.name !== 'AbortError') cambiarError(error.message);
    }).finally(() => { if (!controlador.signal.aborted) cambiarCarga(false); });
    return () => controlador.abort();
  }, [intento]);

  function abrirActividad(actividad) {
    seleccionarActividad(actividad);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return <>
    <a className="saltar" href="#contenido">Ir al contenido</a>
    <header className="cabecera"><a className="marca" href="/" aria-label="Eco Harmony Park, inicio"><img src="/logo.png" alt="Eco Harmony Park" /><span>Eco Harmony <b>Park</b></span></a><a href="#actividades" onClick={() => seleccionarActividad(null)}>Actividades</a><span className="estado">Edición académica</span></header>
    <main id="contenido">
      {seleccionada ? <TerminosActividad key={seleccionada.id} actividad={seleccionada} alVolver={() => seleccionarActividad(null)} /> : <>
        <section className="presentacion"><div><p className="etiqueta">Naturaleza · Encuentro · Aventura</p><h1>Un día para conectar<br />con la naturaleza.</h1><p className="introduccion">Descubrí las actividades de Eco Harmony Park. Explorá, aprendé y encontrá tu próxima aventura al aire libre.</p><a className="boton" href="#actividades">Explorar actividades <span>↗</span></a><p className="horario">08:30 a 19:00 · Cerrado los lunes, el 1/1 y el 25/12</p></div><div className="imagen-marca"><img src="/logo.png" alt="Ilustración del parque con fauna y naturaleza" /></div></section>
        <section id="actividades" className="catalogo" aria-labelledby="titulo-actividades"><div className="encabezado-seccion"><div><p className="etiqueta">Elegí tu experiencia</p><h2 id="titulo-actividades">Actividades del parque</h2></div><p>Cuatro formas de disfrutar el entorno.</p></div>
          {cargando && <p role="status">Cargando actividades…</p>}
          {error && <div className="aviso" role="alert"><p>{error}</p><button onClick={() => cambiarIntento(intento + 1)}>Reintentar</button></div>}
          {!cargando && !error && actividades.length === 0 && <p>No hay actividades disponibles.</p>}
          <div className="grilla">{actividades.map((actividad, indice) => <article className={`tarjeta ${actividad.id}`} key={actividad.id}><div className="ilustracion" aria-hidden="true"><span>{ilustraciones[actividad.id]}</span><small>0{indice + 1}</small></div><div className="contenido-tarjeta"><h3>{actividad.nombre}</h3><p>{actividad.descripcion}</p><ul className="requisitos"><li>{actividad.edadMinima ? `Desde ${actividad.edadMinima} años` : 'Todas las edades'}</li><li>Hasta {actividad.capacidad} personas por turno</li><li>{actividad.requiereTalla ? 'Requiere talla de vestimenta' : 'Sin requisito de talla'}</li></ul><button className="ver-actividad" onClick={() => abrirActividad(actividad)}>Ver condiciones <span aria-hidden="true">↗</span></button></div></article>)}</div>
        </section><aside className="franja"><strong>Tu próxima aventura empieza acá.</strong><p>La inscripción a actividades estará disponible en una próxima etapa.</p></aside>
      </>}
    </main><footer><span>Eco Harmony Park</span><span>Trabajo práctico 6 · Ingeniería y Calidad de Software · Grupo 12</span><a href="/terminos-y-condiciones.pdf" target="_blank" rel="noreferrer">Términos y condiciones ↗</a></footer>
  </>;
}
