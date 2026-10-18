const { DatabaseSync } = require('node:sqlite');
const { mkdirSync } = require('node:fs');
const { dirname, resolve } = require('node:path');

function abrirBaseDeDatos(ruta = resolve(__dirname, '../../datos/parque.sqlite')) {
  if (ruta !== ':memory:') mkdirSync(dirname(ruta), { recursive: true });
  const baseDeDatos = new DatabaseSync(ruta);
  baseDeDatos.exec('PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 5000;');
  return baseDeDatos;
}

module.exports = { abrirBaseDeDatos };
