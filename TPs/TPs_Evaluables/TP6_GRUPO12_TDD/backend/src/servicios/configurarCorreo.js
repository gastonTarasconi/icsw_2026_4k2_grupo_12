const nodemailer = require('nodemailer');
const { crearCorreoSimulado } = require('./confirmacionCorreo');
const { crearCorreoSmtp } = require('./correoSmtp');

function configurarCorreo(env = process.env) {
  const modo = env.CORREO_MODO || 'simulado';
  if (modo === 'simulado') return crearCorreoSimulado().enviar;
  if (modo !== 'smtp') throw new Error('CORREO_MODO debe ser simulado o smtp.');
  if (!env.SMTP_USUARIO || !env.SMTP_CLAVE) {
    throw new Error('Configurá SMTP_USUARIO y SMTP_CLAVE para enviar por Gmail.');
  }
  const transporte = nodemailer.createTransport({
    host: 'smtp.gmail.com', port: 465, secure: true,
    auth: { user: env.SMTP_USUARIO, pass: env.SMTP_CLAVE },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 15000
  });
  return crearCorreoSmtp({ transporte, remitente: env.SMTP_USUARIO });
}

module.exports = { configurarCorreo };
