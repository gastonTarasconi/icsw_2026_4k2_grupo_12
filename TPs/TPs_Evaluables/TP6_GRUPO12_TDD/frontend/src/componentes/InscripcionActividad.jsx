import React, { useEffect, useState } from 'react';
import { consultarTurnos, registrarInscripcion } from '../servicios/api';
import '../estilos/inscripciones.css';
import QRCode from 'qrcode';

const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

function fechaArgentina() {
  const partes = new Intl.DateTimeFormat('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const obtener = tipo => partes.find(parte => parte.type === tipo).value;
  return `${obtener('year')}-${obtener('month')}-${obtener('day')}`;
}

const participanteVacio = () => ({ nombre: '', dni: '', edad: '', talla: '' });

export default function InscripcionActividad({ actividad }) {
  const [fecha, cambiarFecha] = useState(fechaArgentina);
  const [horario, cambiarHorario] = useState('');
  const [turnos, cambiarTurnos] = useState([]);
  const [parqueCerrado, cambiarParqueCerrado] = useState(false);
  const [cargando, cambiarCarga] = useState(false);
  const [participantes, cambiarParticipantes] = useState([participanteVacio()]);
  const [email, cambiarEmail] = useState('');
  const [aceptaTerminos, cambiarTerminos] = useState(false);
  const [guardando, cambiarGuardando] = useState(false);
  const [error, cambiarError] = useState('');
  const [errorTurnos, cambiarErrorTurnos] = useState('');
  const [confirmacion, cambiarConfirmacion] = useState(null);
  const [codigosQr, cambiarCodigosQr] = useState([]);

  useEffect(() => {
    cambiarError('');
  }, [actividad.id, fecha]);

  useEffect(() => {
    const controlador = new AbortController();
    cambiarCarga(true);
    cambiarErrorTurnos('');
    cambiarTurnos([]);
    cambiarParqueCerrado(false);
    cambiarHorario('');
    consultarTurnos(actividad.id, fecha, controlador.signal)
      .then(datos => {
        cambiarTurnos(datos.turnos);
        cambiarParqueCerrado(datos.cerrado);
      })
      .catch(error => {
        if (error.name !== 'AbortError') cambiarErrorTurnos(error.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) cambiarCarga(false);
      });
    return () => controlador.abort();
  }, [actividad.id, fecha]);

  function cambiarCantidad(evento) {
    let cantidad = Number(evento.target.value);
    if (cantidad > actividad.capacidad) cantidad = actividad.capacidad;
    cambiarParticipantes(actuales => Array.from(
      { length: cantidad }, (_, indice) => actuales[indice] ?? participanteVacio()
    ));
  }

  function actualizarParticipante(indice, campo, valor) {
    cambiarParticipantes(actuales => actuales.map(
      (participante, i) => i === indice ? { ...participante, [campo]: valor } : participante
    ));
  }

  async function enviar(evento) {
    evento.preventDefault();
    cambiarError('');
    cambiarGuardando(true);
    try {
      const datos = {
        actividadId: actividad.id,
        fecha,
        horario,
        cantidadPersonas: participantes.length,
        participantes: participantes.map(p => ({
          ...(p.nombre.trim() ? { nombre: p.nombre.trim() } : {}),
          dni: p.dni.trim(),
          edad: Number(p.edad),
          ...(actividad.requiereTalla ? { talla: p.talla } : {})
        })),
        aceptaTerminos,
        email: email.trim()
      };
      const resultado = await registrarInscripcion(datos);
      // La inscripción ya se guardó; un error al dibujar el QR no debe repetir la reserva.
      cambiarConfirmacion(resultado);
      cambiarCodigosQr([]);
      try {
        const imagenes = await Promise.all(participantes.map((_, indice) =>
          QRCode.toDataURL(resultado.confirmacionCorreo.codigosQR[indice], { margin: 2, width: 192 })
        ));
        cambiarCodigosQr(imagenes);
      } catch (errorQr) {
        console.error('No fue posible generar el QR en pantalla.', errorQr);
      }

    const controlador = new AbortController();
    cambiarCarga(true);
    consultarTurnos(actividad.id, fecha, controlador.signal)
      .then(datos => {
        cambiarTurnos(datos.turnos);
        cambiarParqueCerrado(datos.cerrado);
      })
      .catch(error => {
        if (error.name !== 'AbortError') cambiarErrorTurnos(error.message);
      })
      .finally(() => {
        if (!controlador.signal.aborted) cambiarCarga(false);
      });
    } catch (error) {
      cambiarError(error.message);
    } finally {
      cambiarGuardando(false);
    }
  }

  if (confirmacion) {
    return <section className="formulario-inscripcion confirmacion" role="status">
      <h3>Inscripción registrada</h3>
      <p>Reservaste {confirmacion.cantidadPersonas} lugar(es) para {confirmacion.actividad}, el {confirmacion.fecha} a las {confirmacion.horario}.</p>
      <p><strong>Código de confirmación:</strong> <code>{confirmacion.codigo}</code></p>
      <p>La inscripción está guardada en la base de datos local.</p>
      <div className="comprobante-correo">
        <h4>Vista previa del correo de confirmación</h4>
        <p><strong>Destinatario:</strong> {confirmacion.confirmacionCorreo.destinatario}</p>
        <p><strong>Asunto:</strong> {confirmacion.confirmacionCorreo.asunto}</p>
        <iframe title="Diseño del correo de confirmación" sandbox="" srcDoc={confirmacion.confirmacionCorreo.html}
          style={{ width: '100%', height: 620, border: 0, borderRadius: 12 }} />
        <p>{confirmacion.correo.estado === 'simulado'
          ? 'Correo simulado: registrado en la bandeja de esta sesión del servidor; no se envió a la casilla.'
          : confirmacion.correo.estado === 'aceptado'
            ? 'Correo aceptado por el servidor.'
            : 'No se pudo enviar el correo. Tu inscripción sigue confirmada; conservá el código y los QR.'}</p>
      </div>
      <div className="grupo-codigos-qr">
        <h4>Códigos QR de los participantes</h4>
        {codigosQr.length ? codigosQr.map((url, i) =>
          <div className="tarjeta-qr" key={i}>
            <p><strong>Participante {i + 1}</strong></p>
            <img src={url} alt={`Código QR de la reserva para el participante ${i + 1}`} width="192" height="192" />
          </div>
        ) : <p>Generando QR o no disponible en este momento.</p>}
        <p>Los QR contienen solamente un identificador de reserva y número de participante, sin datos personales.</p>
      </div>
      <button type="button" onClick={() => {
        cambiarConfirmacion(null);
        cambiarCodigosQr([]);
        cambiarParticipantes([participanteVacio()]);
        cambiarTerminos(false);
      }}>Realizar otra inscripción</button>
    </section>;
  }

  return <section className="formulario-inscripcion" aria-labelledby="titulo-reserva">
    <h3 id="titulo-reserva">Inscribirme a {actividad.nombre}</h3>
    <p>Elegí un turno y completá los datos de cada participante. Las reservas se permiten entre 24 horas y 15 minutos antes del inicio.</p>
    <form onSubmit={enviar}>
      <div className="campos-reserva">
        <label>Fecha
          <input type="date" value={fecha} min={fechaArgentina()} onChange={e => cambiarFecha(e.target.value)} required />
        </label>
        <label>Horario disponible
          <select value={horario} onChange={e => cambiarHorario(e.target.value)} required disabled={cargando}>
            <option value="">{cargando ? 'Cargando horarios…' : 'Seleccionar turno'}</option>
            {turnos.map(turno => <option key={turno.horario} value={turno.horario} disabled={!turno.disponible}>
              {turno.horario} — {turno.cuposDisponibles} lugar(es) {turno.disponible ? '' : parqueCerrado ? '(parque cerrado)' : turno.cuposDisponibles === 0 ? '(sin cupos)' : '(fuera del plazo de reserva)'}
            </option>)}
          </select>
        </label>
      </div>
      {!cargando && turnos.length > 0 && !turnos.some(t => t.disponible) &&
        <p className="ayuda">{parqueCerrado
          ? 'El parque no abre ese día (lunes, 1 de enero o 25 de diciembre).'
          : turnos.some(t => t.cuposDisponibles > 0)
            ? 'Hay cupos, pero los turnos disponibles están fuera del plazo para reservar: desde 24 horas hasta 15 minutos antes.'
            : 'Los cupos de ese día están completos. Probá con otra fecha.'}</p>}
      <label className="campo-cantidad">Cantidad de participantes (máximo {actividad.capacidad})
        <input type="number" min="1" max={actividad.capacidad} value={participantes.length} onChange={cambiarCantidad} required />
      </label>
      {participantes.map((p, indice) => <fieldset className="grupo-participante" key={indice}>
        <legend>Participante {indice + 1}</legend>
        <div className="campos-reserva">
          <label>Nombre (opcional)
            <input type="text" value={p.nombre} onChange={e => actualizarParticipante(indice, 'nombre', e.target.value)} />
          </label>
          <label>DNI (solo números)
            <input type="text" inputMode="numeric" pattern="[0-9]+" value={p.dni} onChange={e => actualizarParticipante(indice, 'dni', e.target.value)} required />
          </label>
          <label>Edad
            <input type="number" min={actividad.edadMinima} step="1" value={p.edad} onChange={e => actualizarParticipante(indice, 'edad', e.target.value)} required />
          </label>
          {actividad.requiereTalla && <label>Talle
            <select value={p.talla} onChange={e => actualizarParticipante(indice, 'talla', e.target.value)} required>
              <option value="">Seleccionar talle</option>
              {TALLAS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </label>}
        </div>
      </fieldset>)}
      <label className="campo-email">Correo electrónico para la confirmación
        <input type="email" value={email} onChange={e => cambiarEmail(e.target.value)} required />
      </label>
      <label className="aceptacion">
        <input type="checkbox" checked={aceptaTerminos} onChange={e => cambiarTerminos(e.target.checked)} required />
        <span>Leí y acepto los términos y condiciones específicos de {actividad.nombre}.</span>
      </label>
      {errorTurnos && <p className="error-reserva" role="alert">{errorTurnos}</p>}
      {error && <p className="error-reserva" role="alert">{error}</p>}
      <button className="boton-reserva" type="submit" disabled={guardando || cargando || !horario}>
        {guardando ? 'Confirmando…' : 'Confirmar inscripción'}
      </button>
    </form>
  </section>;
}
