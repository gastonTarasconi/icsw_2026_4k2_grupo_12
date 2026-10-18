const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');
const { abrirBaseDeDatos } = require('./conexion');
const actividades = require('./actividades.json');

function inicializarBaseDeDatos(baseDeDatos) {
  baseDeDatos.exec(readFileSync(resolve(__dirname, 'esquema.sql'), 'utf8'));
  const insertar = baseDeDatos.prepare(`INSERT INTO actividades
    (id, nombre, descripcion, edad_minima, capacidad, requiere_talla, terminos)
    VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING`);
  baseDeDatos.exec('BEGIN');
  try {
    for (const actividad of actividades) {
      insertar.run(actividad.id, actividad.nombre, actividad.descripcion,
        actividad.edadMinima, actividad.capacidad, Number(actividad.requiereTalla),
        JSON.stringify(actividad.terminos));
    }
    baseDeDatos.exec('COMMIT');
  } catch (error) {
    baseDeDatos.exec('ROLLBACK');
    throw error;
  }
}

if (require.main === module) {
  require('dotenv').config({ path: resolve(__dirname, '../../.env') });
  const ruta = process.env.RUTA_BASE_DATOS;
  const baseDeDatos = abrirBaseDeDatos(ruta && resolve(__dirname, '../..', ruta));
  try {
    inicializarBaseDeDatos(baseDeDatos);
    console.log('Base de datos inicializada con las cuatro actividades.');
  } finally { baseDeDatos.close(); }
}

module.exports = { inicializarBaseDeDatos };
