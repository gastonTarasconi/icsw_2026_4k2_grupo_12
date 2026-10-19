const { resolve } = require('node:path');
require('dotenv').config({ path: resolve(__dirname, '../.env') });
const { abrirBaseDeDatos } = require('./database/conexion');
const { inicializarBaseDeDatos } = require('./database/inicializar');
const { crearAplicacion } = require('./app');

const ruta = process.env.RUTA_BASE_DATOS;
const baseDeDatos = abrirBaseDeDatos(ruta && resolve(__dirname, '..', ruta));
inicializarBaseDeDatos(baseDeDatos);
// Reloj simulado solamente en desarrollo para probar reservas sin esperar 24 horas.
const relojDePrueba = process.env.NODE_ENV !== 'production' ? process.env.RELOJ_PRUEBA : undefined;
const fechaDePrueba = relojDePrueba ? new Date(relojDePrueba) : null;
if (fechaDePrueba && Number.isNaN(fechaDePrueba.getTime())) {
  throw new Error('RELOJ_PRUEBA debe ser una fecha y hora válida con zona horaria.');
}
const aplicacion = crearAplicacion({
  baseDeDatos,
  origenFrontend: process.env.ORIGEN_FRONTEND,
  ...(fechaDePrueba ? { obtenerAhora: () => new Date(fechaDePrueba.getTime()) } : {})
});
if (fechaDePrueba) {
  console.log(`MODO DE PRUEBA ACTIVADO: reloj simulado ${relojDePrueba}. No utilizar para reservas reales.`);
}
const puerto = Number(process.env.PUERTO || 3001);
const servidor = aplicacion.listen(puerto, () => console.log(`API disponible en http://localhost:${puerto}`));

function cerrarServidor() {
  servidor.close(() => { baseDeDatos.close(); process.exit(0); });
}
process.on('SIGINT', cerrarServidor);
process.on('SIGTERM', cerrarServidor);
