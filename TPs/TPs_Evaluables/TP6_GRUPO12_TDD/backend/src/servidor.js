const { resolve } = require('node:path');
require('dotenv').config({ path: resolve(__dirname, '../.env') });
const { abrirBaseDeDatos } = require('./database/conexion');
const { inicializarBaseDeDatos } = require('./database/inicializar');
const { crearAplicacion } = require('./app');

const ruta = process.env.RUTA_BASE_DATOS;
const baseDeDatos = abrirBaseDeDatos(ruta && resolve(__dirname, '..', ruta));
inicializarBaseDeDatos(baseDeDatos);
const aplicacion = crearAplicacion({ baseDeDatos, origenFrontend: process.env.ORIGEN_FRONTEND });
const puerto = Number(process.env.PUERTO || 3001);
const servidor = aplicacion.listen(puerto, () => console.log(`API disponible en http://localhost:${puerto}`));

function cerrarServidor() {
  servidor.close(() => { baseDeDatos.close(); process.exit(0); });
}
process.on('SIGINT', cerrarServidor);
process.on('SIGTERM', cerrarServidor);
